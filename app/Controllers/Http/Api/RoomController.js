'use strict'
const User = use('App/Models/User')
const Room = use('App/Models/Room')
const Chat = use('App/Models/Chat')
const { MongoClient, ObjectId } = use('mongodb')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with rooms
 */
class RoomController {
  /**
   * Show a list of all rooms.
   * GET rooms
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
      const all = request.all()
      const rooms = await new Promise(async (resolve, reject) => {
        Room.find({ room_users: { $all: [all.user_id] } }).sort({ 'created_at': -1 }).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))

      const datas = []

      for (var i = 0; i < rooms.length; i++) {
        for (var j = 0; j < rooms[i]['room_users'].length; j++) {
          datas[i] = {
            room: rooms[i]
          }

          var chat = await new Promise(async (resolve, reject) => {
            Chat.findOne({ room_id: rooms[i]._id }).sort({ 'created_at': -1 }).then(collection => {
              resolve(collection)
            })
          }).catch(error => console.log(error))

          if (rooms[i]['room_users'][j] != all.user_id) {
            var user = await new Promise(async (resolve, reject) => {
              User.findOne({ _id: new ObjectId(rooms[i]['room_users'][j]) }).then(_collection => {
                resolve(_collection)
              })
            }).catch(error => console.log(error))

            datas[i] = {
              ...datas[i],
              user,
              chat
            }
          }
        }
      }

      return datas
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  /**
   * Render a form to be used for creating a new room.
   * GET rooms/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    try {
      const all = request.all()

      // if (all.form == all.to || !all.form || !all.form) return

      const save = new Room({
        room_name: all.room_name || '',
        room_users: [all.from, all.to] || '',
        modified_at: new Date(),
        created_at: new Date()
      })

      const room = await new Promise(async (resolve, reject) => {
        Room.findOne( { room_users: { $all: [all.from, all.to] } } ).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))

      if (room) return room

      return await new Promise(async (resolve, reject) => {
        save.save().then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Create/save a new room.
   * POST rooms
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async send ({ params, request, response }) {
    try {
      const all = request.all()
      const save = new Chat({
        room_id: params.id || '',
        user_id: all.user_id || '',
        chat_type: all.chat_type || 'text',
        chat_content: all.chat_content || '',
        created_at: new Date()
      })

      await Room.updateOne({
        _id : new ObjectId(params.id) }, {
        $set: { modified_at: new Date() }
      })

      return await new Promise(async (resolve, reject) => {
        save.save().then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  /**
   * Display a single room.
   * GET rooms/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try {
      const all = request.all()
      var datas = {}

      var room = await new Promise(async (resolve, reject) => {
        Room.findOne({ _id: new ObjectId(params.id) }).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))

      var users = await new Promise(async (resolve, reject) => {
        User.find({ _id: { $in: room.room_users } }, { user_name: 1, avatar: 1 }).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))

      var chats = await new Promise(async (resolve, reject) => {
        Chat.find({ room_id: params.id }).sort({ 'created_at': 1 }).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))

      datas = {
        room,
        users,
        chats,
      }

      return datas
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  async room ({ params, request, response, view }) {
    try {
      const all = request.all()
      const rooms = await new Promise(async (resolve, reject) => {
        Room.findOne({ _id: new ObjectId(params.room_id) }).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))

      const datas = {}

      for (var i = 0; i < rooms['room_users'].length; i++) {
        datas = {
          room
        }
      }

      return datas
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  /**
   * Render a form to update an existing room.
   * GET rooms/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update room details.
   * PUT or PATCH rooms/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a room with id.
   * DELETE rooms/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = RoomController

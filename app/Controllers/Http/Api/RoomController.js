'use strict'
const User = use('App/Models/User')
const Room = use('App/Models/Room')
const Chat = use('App/Models/Chat')
const ChatGPT = use('App/Models/ChatGPT')
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

  async listChatGPT ({ params, request, response, view }) {
    try {
      const all = request.all()
      return await new Promise(async (resolve, reject) => {
        ChatGPT.find({ user_id: all.user_id }).sort({ 'created_at': 1 }).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))
    } catch (e) {
      console.log(e)
    }
  }

  async saveChatGPT ({ params, request, response, view }) {
    try {
      const all = request.all()
      const save = new ChatGPT({
        user_id: all.user_id,
        user_role: all.user_role,
        chat_content: all.chat_content,
        created_at: new Date()
      })

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

  async gpt ({ params, request, response, view }) {
    const all = request.all()
    const prompt = '你好，ChatGPT！';
    const axios = require('axios');
    const apiKey = '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';
    // const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    // 设置请求头
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    // 设置对话的起始内容
    const messages = [
      { 'role': 'system', 'content': 'You are a helpful assistant.' },
      { 'role': 'user', 'content': 'Who won the world series in 2020?' },
      { 'role': 'assistant', 'content': 'The Los Angeles Dodgers won the World Series in 2020.' },
      { 'role': 'user', 'content': 'Where was it played?' }
    ];

    // 设置请求体
    const data = {
      'messages': messages,
      'max_tokens': 100 // 可根据需要设置回答的最大长度
    };

    // 发起API请求
    axios.post(apiUrl, data, { headers }).then(response => {
      const answer = response.data.choices[0].message.content;
      console.log('Answer:', answer);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });

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

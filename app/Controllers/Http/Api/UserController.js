'use strict'
const MD5 = use('md5')
const Randomstring = require("randomstring")
const User = use('App/Models/User')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  async login ({ request, response, view }) {
    const all = request.all()

    return await new Promise(async (resolve, reject) => {
      User.findOne({ user_email: all.user_email, user_password: MD5(all.user_password) }).sort({ 'created_at': -1 }).then(collection => {
        resolve(collection)
      })
    }).catch(error => console.log(error))
  }

  async register ({ request, response, view }) {
    const all = request.all()
    const count = await new Promise(async (resolve, reject) => {
      User.find({ user_email: all.user_email }).count().then(collection => {
        resolve(collection)
      })
    }).catch(error => console.log(error))

    if(count == 0) {
      try {
        const save = new User({
          user_id: Randomstring.generate(),
          user_name: all.user_name || '',
          user_email: all.user_email || '',
          user_password: MD5(all.user_password),
          user_identity: '',
          other: {
            school: ''
          },
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
    } else {
      return
    }
  }

  async info ({ params, request, response, view }) {
    const all = request.all()

    if (request.method() == 'GET') {
      return await new Promise(async (resolve, reject) => {
        User.findOne({ _id: params.id }).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))
    }

    return await new Promise(async (resolve, reject) => {
      User.updateOne({ _id: params.id }, {
        $set: {
          user_identity: all.user_identity,
          other: all.other
        }
      }).then(collection => {
        resolve(collection)
      })
    }).catch(error => console.log(error))
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController

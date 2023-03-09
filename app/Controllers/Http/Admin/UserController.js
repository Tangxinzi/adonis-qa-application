'use strict'
const MD5 = use('md5')
const Randomstring = require("randomstring")
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/'
const db = MongoClient.connect('mongodb://127.0.0.1:27017/qa-system')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const users = await new Promise(async (resolve, reject) => {
      await MongoClient.connect('mongodb://127.0.0.1:27017').then((db) => {
        const collection = db.db("qa-system").collection("users").find({}).toArray()
        resolve(collection)
      }).catch(error => console.log('😿 连接数据库失败'))
    })

    return view.render('admin.user.index', {
      data: {
        title: '用户',
        active: 'user',
        users
      }
    })
  }

  async register ({ request, response }) {
    try {
      const all = request.all()
      const data = {
        user_id: Randomstring.generate(),
        user_name: all.user_name || '',
        user_email: all.user_email || '',
        user_password: MD5(all.user_password) || '',
        created_at: new Date()
      }

      MongoClient.connect(url).then(db => {
        db.db("qa-system").collection("users").insertOne(data)
      }).catch(error => console.log('😿 连接数据库失败', error))

      return 'ok'
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  async login ({ request, response }) {
    try {
      const all = request.all()
      return await new Promise(async (resolve, reject) => {
        await MongoClient.connect('mongodb://127.0.0.1:27017').then((db) => {
          const collection = db.db("qa-system").collection("users").findOne({}, {
            projection: { user_email: all.user_email, user_password: MD5(all.user_password), user_id: 1, user_name: 1 }
          })
          resolve(collection)
        }).catch(error => console.log('😿 连接数据库失败', error))
      })
    } catch (e) {
      console.log(e)
    } finally {

    }
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
    try {
      const all = request.all()

      const data = {
        user_name: all.user_name || '',
        user_email: all.user_email || '',
        user_password: all.user_password || '',
      }

      MongoClient.connect(url).then(db => {
        db.db("qa-system").collection("users").updateOne({ user_id: all.user_id }, { $set: data }, { upsert: true })
      }).catch(error => console.log('😿 连接数据库失败', error))

      return 'ok'
    } catch (e) {
      console.log(e)
    } finally {

    }
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

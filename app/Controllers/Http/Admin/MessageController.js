'use strict'
const Randomstring = require("randomstring")
const MongoClient = require('mongodb').MongoClient;
const Mongo = MongoClient.connect('mongodb://127.0.0.1:27017')
const Moment = use('moment')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with messages
 */
class MessageController {
  /**
   * Show a list of all messages.
   * GET messages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
      const all = request.all()
      var messages = await new Promise(async (resolve, reject) => {
        await Mongo.then((db) => {
          const collection = db.db("qa-system").collection("messages").find({}).toArray()
          resolve(collection)
        }).catch(error => console.log('😿 连接数据库失败'))
      })

      messages = [
        {
          id: 1,
          user_id: '',
          username: 'Lindsay',
          image: 'https://semantic-ui.com/images/avatar2/small/lindsay.png',
          description: 'a message',
          date: Moment().format('YYYY-MM-DD'),
          unread: 1
        },
        {
          id: 1,
          user_id: '',
          username: 'Rachel',
          image: 'https://semantic-ui.com/images/avatar2/small/rachel.png',
          description: 'a message',
          date: Moment().format('YYYY-MM-DD'),
          unread: 3
        },
        {
          id: 1,
          user_id: '',
          username: 'Matthew',
          image: 'https://semantic-ui.com/images/avatar2/small/matthew.png',
          description: 'a message',
          date: Moment().format('YYYY-MM-DD'),
          unread: 0
        }
      ]

      if (all.type == 'json') return messages

      return view.render('admin.discover.index', {
        data: {
          title: '消息',
          active: 'messages',
          messages
        }
      })
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  /**
   * Render a form to be used for creating a new message.
   * GET messages/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new message.
   * POST messages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single message.
   * GET messages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing message.
   * GET messages/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update message details.
   * PUT or PATCH messages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a message with id.
   * DELETE messages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = MessageController

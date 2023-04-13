'use strict'
const Randomstring = require("randomstring")
const MongoClient = require('mongodb').MongoClient;
const Mongo = MongoClient.connect('mongodb://127.0.0.1:27017')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with discovers
 */
class DiscoverController {
  /**
   * Show a list of all discovers.
   * GET discovers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
      const all = request.all()
      var new_data = await new Promise(async (resolve, reject) => {
        await Mongo.then((db) => {
          const collection = db.db("qa-system").collection("discover").find({}).toArray()
          resolve(collection)
        }).catch(error => console.log('😿 连接数据库失败'))
      })

      new_data = [
        {
          id: 1,
          question_solve: 0,
          user_id: '',
          title: 'Question title',
          username: 'Matthew',
          image: 'https://semantic-ui.com/images/avatar2/small/matthew.png',
          description: 'USA',
          view: 123,
          labels: ['Job', 'Array']
        },
        {
          id: 1,
          question_solve: 1,
          user_id: '',
          title: 'Question title',
          username: 'Rachel',
          image: 'https://semantic-ui.com/images/avatar2/small/rachel.png',
          description: 'USA',
          view: 124,
          labels: ['Job', 'Array']
        },
        {
          id: 1,
          question_solve: 0,
          user_id: '',
          title: 'bo',
          username: 'Matthew',
          image: 'https://semantic-ui.com/images/avatar2/small/matthew.png',
          description: 'USA',
          view: 125,
          labels: ['Job', 'Array']
        },
      ]

      var unresolved = [
        {
          id: 1,
          question_solve: 0,
          user_id: '',
          title: 'bo',
          image: 'https://t7.baidu.com/it/u=2168645659,3174029352&fm=193&f=GIF',
          description: 'USA',
          view: 125,
          labels: ['Job', 'Array']
        },
        {
          id: 1,
          question_solve: 0,
          user_id: '',
          title: 'bo',
          image: 'https://t7.baidu.com/it/u=2168645659,3174029352&fm=193&f=GIF',
          description: 'USA',
          view: 125,
          labels: ['Job', 'Array']
        },
      ]

      if (all.type == 'json') return {
        new: new_data,
        hot: new_data,
        unresolved
      }

      return view.render('admin.discover.index', {
        data: {
          title: '发现',
          active: 'discover',
          discover
        }
      })
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  /**
   * Render a form to be used for creating a new discover.
   * GET discovers/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new discover.
   * POST discovers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single discover.
   * GET discovers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing discover.
   * GET discovers/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update discover details.
   * PUT or PATCH discovers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a discover with id.
   * DELETE discovers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = DiscoverController

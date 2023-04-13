'use strict'

'use strict'
const Randomstring = require("randomstring")
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/'
const db = MongoClient.connect('mongodb://127.0.0.1:27017/qa-system')

const fs = use("fs");
const QrCode = use('qrcode')
const Moment = use('moment')
const Helpers = use('Helpers')
const Mongodbse = require('../../../../config/mongoose')
const RandomString = use('randomstring')
Moment.locale('zh-cn')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with likes
 */
class LikeController {
  /**
   * Show a list of all likes.
   * GET likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new like.
   * GET likes/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new like.
   * POST likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const all = request.all()
      const data = {
        like: all.like || '',
        relation_user_id: all.relation_user_id || '',
        relation_type: all.relation_type || ''
      }

      if (all.submit == 'create') {
        data.like_id = RandomString.generate()
        MongoClient.connect(url).then(db => {
          db.db("qa-system").collection("likes").insertOne(data)
        }).catch(error => console.log('😿 连接数据库失败', error))
      }

      if (all.submit == 'save') {
        MongoClient.connect(url).then(db => {
          db.db("qa-system").collection("likes").updateOne({ like_id: all.like_id }, { $set: data }, { upsert: true })
        }).catch(error => console.log('😿 连接数据库失败', error))
      }

      return {
        type: 'success',
        message: `${ all.like }`
      }
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  /**
   * Display a single like.
   * GET likes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing like.
   * GET likes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update like details.
   * PUT or PATCH likes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a like with id.
   * DELETE likes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = LikeController

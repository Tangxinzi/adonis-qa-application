'use strict'

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
 * Resourceful controller for interacting with comments
 */
class CommentController {
  /**
   * Show a list of all comments.
   * GET comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new comment.
   * GET comments/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new comment.
   * POST comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const all = request.all()
      const data = {
        comment_detail: all.comment_detail || '',
        comment_user_id: all.comment_user_id || '',
        comment_question_id: all.comment_question_id || ''
      }

      if (all.submit == 'create') {
        data.comment_id = RandomString.generate()
        MongoClient.connect(url).then(db => {
          db.db("qa-system").collection("comments").insertOne(data)
        }).catch(error => console.log('😿 连接数据库失败', error))
      }

      if (all.submit == 'save') {
        MongoClient.connect(url).then(db => {
          db.db("qa-system").collection("comments").updateOne({ comment_id: all.comment_id }, { $set: data }, { upsert: true })
        }).catch(error => console.log('😿 连接数据库失败', error))
      }

      return {
        type: 'success',
        message: `${ all.comment_title } 已更新。`
      }
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  /**
   * Display a single comment.
   * GET comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing comment.
   * GET comments/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update comment details.
   * PUT or PATCH comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a comment with id.
   * DELETE comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = CommentController

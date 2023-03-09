'use strict'
// const Mongoose = require('../../../../config/mongoose')
const Randomstring = require("randomstring")
const MongoClient = require('mongodb').MongoClient;
// const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://127.0.0.1:27017/'
const db = MongoClient.connect('mongodb://127.0.0.1:27017/qa-system')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with questions
 */
class QuestionController {
  /**
   * Show a list of all questions.
   * GET questions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({
    request,
    response,
    view
  }) {
    try {
      const all = request.all()
      const questions = await new Promise(async (resolve, reject) => {
        await MongoClient.connect('mongodb://127.0.0.1:27017').then((db) => {
          const collection = db.db("qa-system").collection("questions").find({}).toArray()
          resolve(collection)
        }).catch(error => console.log('😿 连接数据库失败'))
      })

      if (all.type == 'json') return questions

      return view.render('admin.question.index', {
        data: {
          title: '题库',
          active: 'question',
          questions
        }
      })
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  /**
   * Render a form to be used for creating a new question.
   * GET questions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({
    request,
    response,
    view
  }) {
    try {
      return view.render('admin.question.create', {
        data: {
          title: '创建题目',
          active: 'question'
        }
      })
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  /**
   * Create/save a new question.
   * POST questions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({
    request,
    response,
    session
  }) {
    try {
      const all = request.all()
      const data = {
        question_title: all.question_title || '',
        question_tips: all.question_tips || '',
        question_detail: all.question_detail || '',
        question_status: all.question_status || 0,
        question_level: all.question_level || '',
        question_catalog_id: all.question_catalog_id || '',
        question_label_id: all.question_label_id || ''
      }

      if (all.submit == 'create') {
        data.question_id = Randomstring.generate()
        MongoClient.connect(url).then(db => {
          db.db("qa-system").collection("questions").insertOne(data)
        }).catch(error => console.log('😿 连接数据库失败', error))
      }

      if (all.submit == 'save') {
        MongoClient.connect(url).then(db => {
          db.db("qa-system").collection("questions").updateOne({ question_id: all.question_id }, { $set: data }, { upsert: true })
        }).catch(error => console.log('😿 连接数据库失败', error))
      }

      session.flash({
        type: 'success',
        message: `${ all.question_title } 已更新。`
      })

      return response.route('Admin/QuestionController.index')
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  /**
   * Display a single question.
   * GET questions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({
    params,
    request,
    response,
    view
  }) {}

  /**
   * Render a form to update an existing question.
   * GET questions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({
    params,
    request,
    response,
    view
  }) {
    try {
      const all = request.all()
      const questions = await new Promise(async (resolve, reject) => {
        await MongoClient.connect('mongodb://127.0.0.1:27017').then((db) => {
          const collection = db.db("qa-system").collection("questions").findOne({}, {
            projection: { question_id: params.id, question_title: 1, question_status: 1, question_level: 1, question_catalog_id: 1, question_tips: 1, question_detail: 1 }
          })
          resolve(collection)
        }).catch(error => console.log('😿 连接数据库失败', error))
      })

      if (all.type == 'json') return questions

      return view.render('admin.question.edit', {
        data: {
          title: '题库',
          active: 'question',
          questions
        }
      })
    } catch (e) {

    } finally {

    }
  }

  /**
   * Update question details.
   * PUT or PATCH questions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({
    params,
    request,
    response
  }) {}

  /**
   * Delete a question with id.
   * DELETE questions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({
    params,
    request,
    response
  }) {}
}

module.exports = QuestionController

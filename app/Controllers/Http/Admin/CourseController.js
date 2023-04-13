'use strict'
const Randomstring = require("randomstring")
const MongoClient = require('mongodb').MongoClient;
const Mongo = MongoClient.connect('mongodb://127.0.0.1:27017')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tutors
 */
class CourseController {
  /**
   * Show a list of all tutors.
   * GET tutors
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
      const all = request.all()
      var tutors = await new Promise(async (resolve, reject) => {
        await Mongo.then((db) => {
          const collection = db.db("qa-system").collection("tutors").find({}).toArray()
          resolve(collection)
        }).catch(error => console.log('😿 连接数据库失败'))
      })

      tutors = [
        {
          user_id: '',
          user_name: 'Veronika Ossi',
          user_avatar: 'https://semantic-ui.com/images/avatar/small/veronika.jpg',
          country: 'USA',
          school: 'School',
          job: 'Job',
          focus: 'Area',
        },
        {
          user_id: '',
          user_name: 'Jenny',
          user_avatar: 'https://semantic-ui.com/images/avatar/small/jenny.jpg',
          country: 'USA',
          school: 'School',
          job: 'Job',
          focus: 'Area',
        },
        {
          user_id: '',
          user_name: 'Matthew',
          user_avatar: 'https://semantic-ui.com/images/avatar2/small/matthew.png',
          country: 'USA',
          school: 'School',
          job: 'Job',
          focus: 'Area',
        },
      ]

      var event = [
        {
          title: 'title',
          content: 'content...',
          time: 'now',
          upcoin: '12'
        },
        {
          title: 'title',
          content: 'content...',
          time: 'now',
          upcoin: '12'
        },
        {
          title: 'title',
          content: 'content...',
          time: 'now',
          upcoin: '12'
        },
      ]

      if (all.type == 'json') return {
        tutors,
        event
      }

      return view.render('admin.course.index', {
        data: {
          title: '课程',
          active: 'tutors',
          tutors
        }
      })
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  /**
   * Render a form to be used for creating a new course.
   * GET tutors/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new course.
   * POST tutors
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, session }) {
    const all = request.all()
    const data = {
      course_title: all.course_title || '',
      course_tips: all.course_tips || '',
      course_detail: all.course_detail || '',
      course_status: all.course_status || 0,
      course_level: all.course_level || '',
      course_catalog_id: all.course_catalog_id || '',
      course_label_id: all.course_label_id || ''
    }

    if (all.submit == 'create') {
      data.course_id = RandomString.generate()
      MongoClient.connect(url).then(db => {
        db.db("qa-system").collection("tutors").insertOne(data)
      }).catch(error => console.log('😿 连接数据库失败', error))
    }

    if (all.submit == 'save') {
      MongoClient.connect(url).then(db => {
        db.db("qa-system").collection("tutors").updateOne({ course_id: all.course_id }, { $set: data }, { upsert: true })
      }).catch(error => console.log('😿 连接数据库失败', error))
    }

    session.flash({
      type: 'success',
      message: `${ all.course_title } 已更新。`
    })

    return response.route('Admin/courseController.index')
  }

  /**
   * Display a single course.
   * GET tutors/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing course.
   * GET tutors/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update course details.
   * PUT or PATCH tutors/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a course with id.
   * DELETE tutors/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = CourseController

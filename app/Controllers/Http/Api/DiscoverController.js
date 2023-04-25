'use strict'
const MD5 = use('md5')
const Randomstring = require("randomstring")
const Question = use('App/Models/Question')
const Like = use('App/Models/Like')
const Star = use('App/Models/Star')
const Comment = use('App/Models/Comment')

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
    const all = request.all()

    if(all.type == 'question') {
      return await new Promise(async (resolve, reject) => {
        Question.aggregate([
          // { "$match": { question_solve: { $eq: '' } } },
          {
            "$project": {
              "u_id": {
                "$convert": {
                  "input": "$user_id",
                  "to": "objectId"
                }
              },
              user_id: 1,
              question_title: 1,
              question_detail: 1,
              question_tips: 1,
              question_status: 1,
              question_solve: 1,
              question_view: 1,
              question_name: 1,
              question_code: 1,
              file: 1,
              created_at: 1
            }
          },
        	{
        		$lookup: {
              localField: 'u_id',  // 本地关联的字段
        			from: 'users',  // 关联的集合
              foreignField: '_id',  // 对方集合关联的字段
        			as: 'userinfo',  // 结果字段名,
        		},
        	},
        	{
        		 $sort: {
        		   'created_at': -1
        		 }
        	},
        ]).then(async(collection) => {
          for (var i = 0; i < collection.length; i++) {
            collection[i].like = await Like.count({ question_id: collection[i]._id.toString() })
            collection[i].star = await Star.count({ question_id: collection[i]._id.toString() })
            collection[i].comment = await Comment.count({ question_id: collection[i]._id.toString() })
          }
          resolve(collection)
        })
      }).catch(error => console.log(error))
    }

    return
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

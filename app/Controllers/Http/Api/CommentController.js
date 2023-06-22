'use strict'
const Coin = use('App/Models/Coin')
const Comment = use('App/Models/Comment')

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
    const all = request.all()

    return await new Promise(async (resolve, reject) => {
      Comment.find({ user_id: all.user_id }).sort({ 'created_at': -1 }).then(collection => {
        resolve(collection)
      })
    }).catch(error => console.log(error))
  }

  async createCoin(user_id, related_id, coin_type, num) {
    const save = new Coin({
      user_id,
      related_id,
      coin_type,
      num,
      created_at: new Date()
    })

    return await new Promise(async (resolve, reject) => {
      save.save().then(collection => {
        resolve(collection)
      })
    }).catch(error => console.log(error))
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
    try {
      const all = request.all()
      const save = new Comment({
        question_id: all.question_id,
        user_id: all.user_id || '',
        comment_content: all.comment_content || '',
        created_at: new Date()
      })

      var comment = await new Promise(async (resolve, reject) => {
        save.save().then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))

      await this.createCoin(all.user_id, all.question_id, 'Comment', 100);

      return comment
    } catch (e) {
      console.log(e)
    }
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

'use strict'
const Coin = use('App/Models/Coin')
const Question = use('App/Models/Question')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with comments
 */
class CoinController {
  async index ({ request, response, view }) {
    const all = request.all()

    if (!all.user_id) return []

    const _coins = await new Promise(async (resolve, reject) => {
      Coin.find({ user_id: all.user_id }).sort({ 'created_at': -1 }).then(collection => {
        resolve(collection)
      })
    }).catch(error => console.log(error))

    var sum = 0, coins = []
    for (var i = 0; i < _coins.length; i++) {
      sum += _coins[i].num
      switch (_coins[i].coin_type) {
        case 'Question':
          coins[i] = {
            user_id: _coins[i].user_id,
            related_id: _coins[i].related_id,
            content: 'Created a question',
            num: _coins[i].num,
            coin_type: _coins[i].coin_type,
            data: await new Promise(async (resolve, reject) => Question.findOne({ _id: _coins[i].related_id }).then(collection => resolve(collection)))
          }
          break;
        default:
          coins[i] = _coins[i]
      }
    }

    return {
      sum,
      coins
    }
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

      return await new Promise(async (resolve, reject) => {
        save.save().then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))
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

module.exports = CoinController

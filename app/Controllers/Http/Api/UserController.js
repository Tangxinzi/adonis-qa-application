'use strict'
const MD5 = use('md5')
const Moment = use('moment')
const Randomstring = require("randomstring")
const Question = use('App/Models/Question')
const User = use('App/Models/User')
const Like = use('App/Models/Like')
const Star = use('App/Models/Star')
const Sign = use('App/Models/Sign')
const Event = use('App/Models/Event')
const Comment = use('App/Models/Comment')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  async login ({ request, response, view }) {
    const all = request.all()

    return await new Promise(async (resolve, reject) => {
      User.findOne({ user_email: all.user_email, user_password: MD5(all.user_password) }).sort({ 'created_at': -1 }).then(collection => {
        resolve(collection)
      })
    }).catch(error => console.log(error))
  }

  async register ({ request, response, view }) {
    const all = request.all()
    const count = await new Promise(async (resolve, reject) => {
      User.find({ user_email: all.user_email }).count().then(collection => {
        resolve(collection)
      })
    }).catch(error => console.log(error))

    if(count == 0) {
      try {
        const save = new User({
          user_id: Randomstring.generate(),
          user_name: all.user_name || '',
          user_email: all.user_email || '',
          user_password: MD5(all.user_password),
          user_identity: all.user_identity || '',
          other: {
            school: ''
          },
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
    } else {
      return
    }
  }

  async info ({ params, request, response, view }) {
    const all = request.all()

    if (request.method() == 'GET') {
      return await new Promise(async (resolve, reject) => {
        User.findOne({ _id: params.id }).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))
    }

    if (request.method() == 'POST') {
      var set = {
        $set: {
          user_identity: all.user_identity,
          other: all.other
        }
      }

      if (all.type == 'avatar') {
        set = {
          $set: {
            avatar: all.avatar,
          }
        }
      }

      return await new Promise(async (resolve, reject) => {
        User.updateOne({ _id: params.id }, set).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))
    }

    return
  }

  async events ({ request, response, view }) {
   const all = request.all()

   return await new Promise(async (resolve, reject) => {
     Event.find({ user_id: all.user_id }).sort({ 'created_at': -1 }).then(collection => {
       resolve(collection)
     })
   }).catch(error => console.log(error))
  }

  async tutors ({ request, response, view }) {
   const all = request.all()

   return await new Promise(async (resolve, reject) => {
     User.find({ user_identity: 'Tutor' }).sort({ 'created_at': -1 }).then(collection => {
       resolve(collection)
     })
   }).catch(error => console.log(error))
  }

  async favorites ({ request, response }) {
    const all = request.all()
    return await new Promise(async (resolve, reject) => {
      Star.find({ user_id: all.user_id }).sort({ 'created_at': -1 }).then(async (collection) => {
        var data = []
        for (var i = 0; i < collection.length; i++) {
          data[i] = {
            question: await Question.findOne({ _id: collection[i].question_id }),
            like: await Like.count({ question_id: collection[i].question_id }),
            star: await Star.count({ question_id: collection[i].question_id }),
            comment: await Comment.count({ question_id: collection[i].question_id }),
            created_at: collection[i]['created_at'],
          }
        }
        resolve(data)
      })
    }).catch(error => console.log(error))
  }

  async sign ({ request, response, view }) {
    try {
      const all = request.all()

      // 用户签到 days
      if (request.method() == 'GET') {
        return await new Promise(async (resolve, reject) => {
          Sign.find({ user_id: all.user_id }).sort({ 'created_at': -1 }).then(collection => {
            resolve(collection)
          })
        }).catch(error => console.log(error))
      }

      // 已存在 sign 数据
      const sign = await new Promise(async (resolve, reject) => {
        Sign.findOne({ user_id: all.user_id, day: Moment().format('YYYY-MM-DD') }).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))

      if (sign) return true

      const save = new Sign({
        user_id: all.user_id,
        day: Moment().format('YYYY-MM-DD'),
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

  async days ({ request, response, view }) {
    try {
      const all = request.all(), datas = []

      for (var i = 0; i < 7; i++) {
        const data = await new Promise(async (resolve, reject) => {
          Sign.findOne({ user_id: all.user_id, day: Moment().weekday(i + 1).format('YYYY-MM-DD') }).then(collection => {
            resolve(collection)
          })
        }).catch(error => console.log(error))

        datas[i] = {
          active: data ? true : false,
          text: Moment().weekday(i + 1).format('YYYY-MM-DD'),
          time: Moment().weekday(i + 1).format('DD'),
        }
      }

      return datas;
    } catch (e) {
      console.log(e)
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

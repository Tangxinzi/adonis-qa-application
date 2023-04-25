'use strict'
const MD5 = use('md5')
const Randomstring = use("randomstring")
const User = use('App/Models/User')
const Like = use('App/Models/Like')
const Star = use('App/Models/Star')
const Question = use('App/Models/Question')
const { MongoClient, ObjectId } = use('mongodb')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with questions
 */
class QuestionController {
  async lists ({ request, response, view }) {
   const all = request.all()

   return await new Promise(async (resolve, reject) => {
     Question.find().sort({ 'created_at': -1 }).then(collection => {
       resolve(collection)
     })
   }).catch(error => console.log(error))
  }

 async star ({ request, response, view }) {
   try {
     const all = request.all()

     // 如果已存在 star 数据，则删除
     const star = await new Promise(async (resolve, reject) => {
       Star.findOne({ question_id: all.question_id, user_id: all.user_id }).then(collection => {
         resolve(collection)
       })
     }).catch(error => console.log(error))

     if(star) {
       return await new Promise(async (resolve, reject) => {
         Star.deleteOne({ question_id: all.question_id, user_id: all.user_id }).then(collection => {
           resolve(collection)
         })
       }).catch(error => console.log(error))
     }

     const save = new Star({
       question_id: all.question_id,
       user_id: all.user_id || '',
       star_status: all.star_status || '',
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

 async like ({ request, response, view }) {
   try {
     const all = request.all()

     // 如果已存在 like 数据，则删除
     const like = await new Promise(async (resolve, reject) => {
       Like.findOne({ question_id: all.question_id, user_id: all.user_id }).then(collection => {
         resolve(collection)
       })
     }).catch(error => console.log(error))

     if(like) {
       return await new Promise(async (resolve, reject) => {
         Like.deleteOne({ question_id: all.question_id, user_id: all.user_id }).then(collection => {
           resolve(collection)
         })
       }).catch(error => console.log(error))
     }


     const save = new Like({
       question_id: all.question_id,
       user_id: all.user_id || '',
       like_status: all.like_status || '',
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
   * Show a list of all questions.
   * GET questions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const all = request.all()

    return await new Promise(async (resolve, reject) => {
      Question.find({ user_id: all.user_id }).then(collection => {
        resolve(collection)
      })
      // .sort({ 'created_at': -1 })
    }).catch(error => console.log(error))
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
  async create ({ request, response, view }) {
    try {
      const all = request.all()
      const save = new Question({
        question_id: Randomstring.generate(),
        question_name: all.question_name || '',
        question_code: all.question_code || '',
        file: all.file || '',
        user_id: all.user_id,
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
   * Create/save a new question.
   * POST questions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
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
  async show ({ params, request, response, view }) {
    const all = request.all()

    await Question.updateOne({
      "_id" : new ObjectId(params.id) }, {
      $inc: { question_view: 1 }
    }).then(collection => {
      // console.log(collection)
    })

    const like = await new Promise(async (resolve, reject) => {
      Like.findOne({ question_id: params.id, user_id: all.user_id }).then(collection => {
        resolve(collection)
      })
    }).catch(error => console.log(error))

    const star = await new Promise(async (resolve, reject) => {
      Star.findOne({ question_id: params.id, user_id: all.user_id }).then(collection => {
        resolve(collection)
      })
    }).catch(error => console.log(error))

    return await new Promise(async (resolve, reject) => {
      Question
        .aggregate([
        { "$match": { _id: { $eq: new ObjectId(params.id) } } },
        {
          "$project": {
            "u_id": {
              "$convert": {
                "input": "$user_id",
                "to": "objectId"
              }
            },
            "q_id": {
              "$convert": {
                "input": "$_id",
                "to": "string"
              }
            },
            _id: 1,
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
          $lookup: {
            localField: 'q_id',
            from: 'comments',
            foreignField: 'question_id',
            as: 'comments',
          },
        }
      ]).then(async (collection) => {
        for (var i = 0; i < collection[0].comments.length; i++) {
          collection[0].comments[i]['userinfo'] = await new Promise((resolve, reject) => {
            User.findOne({ _id: collection[0].comments[i].user_id }, {
              user_name: 1,
              avatar: 1
            }).then(collection => {
              resolve(collection)
            })
          }).catch(error => console.log(error))
        }
        collection[0].like = like
        collection[0].star = star
        collection[0].count = [
          await Like.count({ question_id: collection[0].q_id }),
          await Star.count({ question_id: collection[0].q_id })
        ]
        resolve(collection)
      })
    }).catch(error => console.log(error))
  }

  /**
   * Render a form to update an existing question.
   * GET questions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update question details.
   * PUT or PATCH questions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a question with id.
   * DELETE questions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = QuestionController

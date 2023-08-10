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
const Follow = use('App/Models/Follow')
const Recent = use('App/Models/Recent')

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
      return 'error'
    }
  }

  async info ({ params, request, response, view }) {
    const all = request.all()

    if (request.method() == 'GET') {
      return await new Promise(async (resolve, reject) => {
        User.findOne({ _id: params.id }).then(async collection => {
          var userinfo = collection
          if (all.to_follow_id) {
            userinfo._doc.follow_status = await new Promise(async (resolve, reject) => {
              Follow.findOne({
                user_id: all.to_follow_id,
                follow_id: params.id
              }).then(follow => {
                resolve(follow ? follow.follow_status : false)
              })
            }).catch(error => console.log(error))
          }
          resolve(userinfo)
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
  }

  async data ({ params, request, response, view }) {
    const count = [
      {
        text: 'Like',
        number: await Like.count({ user_id: params.id })
      },
      {
        text: 'Star',
        number: await Star.count({ user_id: params.id })
      },
      {
        text: 'Follow',
        number: await Follow.count({ follow_id: params.id })
      },
      {
        text: 'Comment',
        number: await Comment.count({ user_id: params.id })
      },
    ]

    return {
      count
    }
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

  // 浏览记录
  async recents ({ request, response }) {
    const all = request.all()
    return await new Promise(async (resolve, reject) => {
      Recent.find({ user_id: all.user_id }).sort({ 'created_at': -1 }).then(async (collection) => {
        var data = []
        for (var i = 0; i < collection.length; i++) {
          data[i] = {
            question: await Question.findOne({ _id: collection[i].recent_id }),
            type: collection[i].recent_type,
            date: collection[i].recent_date,
            created_at: Moment(collection[i]['created_at']).format('YYYY-MM-DD hh:mm:ss'),
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

  async follow({
    request,
    response,
    view
  }) {
    try {
      const all = request.all()

      const follow = await new Promise(async (resolve, reject) => {
        Follow.findOne({
          follow_id: all.follow_id,
          user_id: all.user_id
        }).then(collection => {
          resolve(collection)
        })
      }).catch(error => console.log(error))

      // 如果已存在 follow 数据，则删除
      if (follow) {
        return await new Promise(async (resolve, reject) => {
          if (all.follow_status == 'false') {
            Follow.deleteOne({
              follow_id: all.follow_id,
              user_id: all.user_id
            }).then(collection => {
              resolve(collection)
            })
          } else {
            Follow.findOne({
              follow_id: all.follow_id,
              user_id: all.user_id
            }).then(collection => {
              resolve(collection)
            })
          }
        }).catch(error => console.log(error))
      }

      const save = new Follow({
        follow_id: all.follow_id,
        user_id: all.user_id,
        follow_status: all.follow_status || '',
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
}

module.exports = UserController

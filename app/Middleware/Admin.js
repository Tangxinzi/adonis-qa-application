'use strict'

const fs = use("fs");
const MD5 = use('md5')
const QrCode = use('qrcode')
const Moment = use('moment')
const Helpers = use('Helpers')
const Database = use('Database')
const Jwt = use('App/Models/Jwt')
const RandomString = use('randomstring')
Moment.locale('zh-cn')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, session }, next) {
    // call next to advance the request

    // Check 中间件，判断登录
    try {
      const sign = session.get('adonis-cookie-sign')
      const user = await Database.table('users').where({ 'id': Jwt.verifyPublicKey(sign), type: 521 }).limit(1)
      if (sign && user.length) {
        response.cookie('adonis-cookie-sign', sign)
        await next()
      } else {
        return response.route('UserController.login')
      }
    } catch (e) {
      return response.route('UserController.login')
    } finally {

    }
  }
}

module.exports = Admin

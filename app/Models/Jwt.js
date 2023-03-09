'use strict'

const Fs = use('fs')
const Env = use('Env')
const Model = use('Model')
const Jwtoken = use('jsonwebtoken')

class Jwt extends Model {
  // HS256
  static sign (data) {
    return Jwtoken.sign(JSON.parse(data), Env.get('APP_KEY'))
  }

  static verify (token) {
    return Jwtoken.verify(token, Env.get('APP_KEY'))
  }

  static decode (token) {
    return Jwtoken.decode(token, Env.get('APP_KEY'))
  }

  // RS256
  static signPrivateKey (data) {
    try {
      return Jwtoken.sign(JSON.parse(data), Fs.readFileSync('./config/pem/private.key'), { algorithm: 'RS256' })
    } catch (e) {
      console.log(e);
    }
  }

  static verifyPublicKey (token) {
    try {
      return Jwtoken.verify(token, Fs.readFileSync('./config/pem/public.key'))
    } catch (e) {
      console.log(e);
    }
  }

  static decodeKey (token) {
    return Jwtoken.decode(token)
  }
}

module.exports = Jwt

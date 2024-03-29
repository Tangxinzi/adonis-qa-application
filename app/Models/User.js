const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  user_id: {
    type: String
  },
  user_name: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  user_password: {
    type: String,
    required: true
  },
  user_identity: {
    type: String
  },
  other: {
    type: Object
  },
  created_at: {
    type: Date
  },
}, options)

const User = db.model('User', schema)

module.exports = User

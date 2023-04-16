const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  user_id: {
    type: String
  },
  user_name: {
    type: String
  },
  user_email: {
    type: String
  },
  user_password: {
    type: String
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

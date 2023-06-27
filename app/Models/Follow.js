const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  follow_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  follow_status: {
    type: Boolean,
    required: true
  },
  created_at: {
    type: Date
  },
}, options)

const Follow = db.model('follows', schema)

module.exports = Follow

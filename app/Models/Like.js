const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  question_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  like_status: {
    type: Boolean,
    required: true
  },
  created_at: {
    type: Date
  },
}, options)

const Like = db.model('likes', schema)

module.exports = Like

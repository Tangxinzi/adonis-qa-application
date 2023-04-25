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
  comment_content: {
    type: String,
    required: true
  },
  created_at: {
    type: Date
  },
}, options)

const Comment = db.model('comments', schema)

module.exports = Comment

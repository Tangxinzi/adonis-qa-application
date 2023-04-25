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
  star_status: {
    type: Boolean,
    required: true
  },
  created_at: {
    type: Date
  },
}, options)

const Star = db.model('stars', schema)

module.exports = Star

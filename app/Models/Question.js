const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  question_id: {
    type: String
  },
  user_id: {
    type: String,
    required: true
  },
  question_name: {
    type: String
  },
  question_code: {
    type: String
  },
  question_title: {
    type: String
  },
  question_detail: {
    type: String
  },
  question_tips: {
    type: String
  },
  question_solve: {
    type: Boolean
  },
  question_status: {
    type: String
  },
  question_level: {
    type: String
  },
  question_catalog_id: {
    type: String
  },
  question_label_id: {
    type: String
  },
  question_view: {
    type: Number
  },
  file: {
    type: String
  },
  created_at: {
    type: Date
  },
}, options)

const Question = db.model('question', schema)

module.exports = Question

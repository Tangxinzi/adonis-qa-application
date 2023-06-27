const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  user_id: {
    type: String,
    required: true
  },
  user_role: {
    type: String,
    required: true
  },
  chat_content: {
    type: String,
    required: true
  },
  created_at: {
    type: Date
  },
}, options)

const ChatGPT = db.model('chatgpt', schema)

module.exports = ChatGPT

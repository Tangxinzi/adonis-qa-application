const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  room_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  chat_type: {
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

const Chat = db.model('chats', schema)

module.exports = Chat

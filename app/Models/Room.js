const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  room_name: {
    type: String
  },
  room_users: {
    type: Array,
    required: true
  },
  modified_at: {
    type: Date
  },
  created_at: {
    type: Date
  },
}, options)

const Room = db.model('rooms', schema)

module.exports = Room

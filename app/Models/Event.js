const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  user_id: {
    type: String,
    required: true
  },
  event_title: {
    type: String,
    required: true
  },
  event_content: {
    type: String,
    required: true
  },
  event_start_time: {
    type: String,
    required: true
  },
  event_duration: {
    type: Number,
    required: true
  },
  event_coin: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date
  },
}, options)

const Event = db.model('events', schema)

module.exports = Event

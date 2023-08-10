const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  recent_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  recent_type: {
    type: String,
    required: true
  },
  recent_date: {
    type: String,
    required: true
  },
  created_at: {
    type: Date
  },
}, options)

const Recent = db.model('recents', schema)

module.exports = Recent

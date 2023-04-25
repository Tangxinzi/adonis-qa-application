const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  user_id: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  created_at: {
    type: Date
  },
}, options)

const Sign = db.model('signs', schema)

module.exports = Sign

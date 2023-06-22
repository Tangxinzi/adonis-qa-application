const db = require('../../config/mongoose')

const options = {

}

const schema = new db.Schema({
  user_id: {
    type: String,
    required: true
  },
  related_id: {
    type: String,
    required: true
  },
  coin_type: {
    type: String,
    required: true
  },
  num: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date
  },
}, options)

const Coin = db.model('coins', schema)

module.exports = Coin

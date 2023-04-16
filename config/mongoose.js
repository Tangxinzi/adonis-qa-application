#!/usr/bin/env node

// 'use strict';
//
// const mongoose = require('mongoose');
// // mongoose.set('useFindAndModify', false);
//
// mongoose.connect('mongodb://localhost:27017/qa-system', {
//   useNewUrlParser: true
// });
// const conn = mongoose.connection;
// const Schema = mongoose.Schema;
//
// const schema = new Schema({
//   user_id: String,
//   user_name: String,
//   user_email: String,
//   user_password: String,
//   created_at: String
// });
//
// const Users = mongoose.model('Users', schema);
//
// const insert = (data) => {
//
// }
//
//
// module.exports = {
//   insert
// }

const mongoose = require('mongoose')

const uri = 'mongodb://localhost:27017/qa-system'
const options = {
  // useMongoClient: true,
  useNewUrlParser: true
}

mongoose.Promise = global.Promise
mongoose
  .connect(uri, options)
  .then(db => console.log('Database connection success'))
  .catch(error => console.log('Database connection fail', error))

module.exports = mongoose

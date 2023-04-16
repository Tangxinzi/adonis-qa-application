#!/usr/bin/env node
'use strict';

const mongoose = require('mongoose');
// mongoose.set('useFindAndModify', false);

const url = 'mongodb://localhost:27017/test';
const opts = { useNewUrlParser: true };

mongoose.connect(url, opts);
const conn = mongoose.connection;
const Schema = mongoose.Schema;

const schema = new Schema({
  name: String
});

const Test = mongoose.model('test', schema);

async function findOneAndUpdate() {
  await conn.dropDatabase();
  let admin = conn.db.admin();
  let { version } = await admin.serverInfo();
  console.log(`mongodb: ${version}`);
  console.log(`mongoose: ${mongoose.version}`);

  let cond = {};
  let update = { name: 'Sarah' };
  let opts = {
    upsert: true,
    new: true
  };

  let sarah = await Test.findOneAndUpdate(cond, update, opts);
  console.log(sarah);
  return conn.close();
}

findOneAndUpdate();

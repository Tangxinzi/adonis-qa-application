const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/';

// MongoClient.connect(url).then(db => console.log('😄 连接数据库成功')).catch(error => console.log('😿 连接数据库失败'))

const insert = (data) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
  }).then(db => {
    var dbo = db.db("qa-system")

    var myobj = [{
        name: '菜鸟工具',
        url: 'https://c.runoob.com',
        type: 'cn'
      },
      {
        name: 'Google',
        url: 'https://www.google.com',
        type: 'en'
      },
      {
        name: 'Facebook',
        url: 'https://www.google.com',
        type: 'en'
      }
    ];

    dbo.collection("site").insertMany(myobj, function(err, res) {
      if (err) throw err;
      console.log("插入的文档数量为: " + res.insertedCount);
      db.close();
    });
  }).catch(error => console.log('😿 连接数据库失败'))
}


module.exports = { insert }

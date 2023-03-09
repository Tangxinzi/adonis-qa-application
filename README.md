# Adonis fullstack application

This is the fullstack boilerplate for AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick
```

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

## Create

```js
Controller: adonis make:controller collection --resource
```

## Run

```js
adonis serve --dev
```

## Mac 建立映射端口

```js
sudo curl -o install.sh "https://download.51miaole.com/install.sh" && sudo bash ./install.sh --username jiangkun --token f6fe94a2ad2aa310ab9ad0c57aad7f98
```

## SQL
```sql
  null - 草稿，0 - 审核，1 - 通过，2 - 失败，3 - 删除，4 - 下架
```

## 连接配置
```
'use strict'

const Env = use('Env')
const Helpers = use('Helpers')
const Moment = use('moment')
var config = {
  server: 'localhost',    //服务器地址
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',    //用户名
      password: 'sql2016.'    //密码
    }
  },
  options: {
    encrypt: false,//  如果不是 Microsoft Azure，则必须设置为 false，否则报错
    database: 'UFDATA_956_2022',    //数据库
    port: 1433  // 端口号
  }
};
```
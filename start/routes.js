'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get('/question', 'Admin/QuestionController.index')
  Route.get('/question/create', 'Admin/QuestionController.create')
  Route.get('/question/edit/:id', 'Admin/QuestionController.edit')

  Route.get('/user', 'Admin/UserController.index')

  Route.get('/page', 'Admin/PageController.index')
  Route.get('/page/create', 'Admin/PageController.create')
  Route.post('/page/create', 'Admin/QuestionController.store')
  Route.get('/page/edit/:id', 'Admin/PageController.edit')
}).prefix('/admin')
// .middleware(['check'])

Route.group(() => {
  Route.get('/question', 'Admin/QuestionController.index')
  Route.get('/question/show/:id', 'Admin/QuestionController.edit')

  Route.get('/course', 'Admin/CourseController.index')
  Route.post('/course/store', 'Admin/CourseController.store')

  Route.get('/discover', 'Admin/DiscoverController.index')
  Route.get('/message', 'Admin/MessageController.index')
  Route.get('/user/userinfo', 'Admin/UserController.userinfo')

  Route.post('/user/login', 'Admin/UserController.login')
  Route.post('/user/register', 'Admin/UserController.register')
  Route.post('/user/like', 'Admin/LikeController.store')
  Route.post('/user/comment', 'Admin/CommentController.store')
}).prefix('/api')

Route.group(() => {
  Route.get('/search', 'Api/SearchController.index')

  Route.get('/discover', 'Api/DiscoverController.index')

  Route.post('/file/upload', 'Api/FileController.upload')
  Route.post('/tool/ocr', 'Api/ToolController.ocr')

  Route.post('/user/login', 'Api/UserController.login')
  Route.post('/user/register', 'Api/UserController.register')
  Route.get('/user/info/:id', 'Api/UserController.info')
  Route.post('/user/info/:id', 'Api/UserController.info')
  Route.get('/user/data/:id', 'Api/UserController.data')
  Route.get('/user/tutors', 'Api/UserController.tutors')
  Route.get('/user/favorites', 'Api/UserController.favorites')
  Route.get('/user/events', 'Api/UserController.events')
  Route.get('/user/sign', 'Api/UserController.sign')
  Route.post('/user/sign', 'Api/UserController.sign')
  Route.get('/user/follow', 'Api/UserController.follow')
  Route.get('/user/sign/days', 'Api/UserController.days')
  Route.get('/user/comment', 'Api/CommentController.index')
  Route.post('/comment/create', 'Api/CommentController.create')

  Route.get('/question', 'Api/QuestionController.index')
  Route.get('/question/lists', 'Api/QuestionController.lists')
  Route.get('/question/show/:id', 'Api/QuestionController.show')
  Route.post('/question/create', 'Api/QuestionController.create')
  Route.post('/question/like', 'Api/QuestionController.like')
  Route.post('/question/star', 'Api/QuestionController.star')

  Route.get('/event', 'Api/EventController.index')
  Route.get('/event/lists', 'Api/EventController.lists')
  Route.post('/event/create', 'Api/EventController.create')

  Route.get('/chat', 'Api/RoomController.index')
  Route.get('/chat/room/:id', 'Api/RoomController.room')
  Route.get('/chat/show/:id', 'Api/RoomController.show')
  Route.post('/chat/send/:id', 'Api/RoomController.send')
  Route.post('/chat/gpt', 'Api/RoomController.gpt')
  Route.post('/chat/create', 'Api/RoomController.create')

  // CHATGPT 机器人聊天
  Route.get('/chat/chatgpt/list', 'Api/RoomController.listChatGPT')
  Route.post('/chat/chatgpt/save', 'Api/RoomController.saveChatGPT')

  Route.get('/coin', 'Api/CoinController.index')
}).prefix('/api/v2')

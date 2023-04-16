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
  Route.get('/discover', 'Api/DiscoverController.index')

  Route.post('/file/upload', 'Api/FileController.upload')

  Route.post('/user/login', 'Api/UserController.login')
  Route.post('/user/register', 'Api/UserController.register')
  Route.get('/user/info/:id', 'Api/UserController.info')
  Route.post('/user/info/:id', 'Api/UserController.info')

  Route.get('/question', 'Api/QuestionController.index')
  Route.post('/question/create', 'Api/QuestionController.create')
}).prefix('/api/v2')

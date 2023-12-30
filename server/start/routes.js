'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

'use strict'

const Route = use('Route')

Route.post('/api/deposit', 'DepositController.create')
Route.post('/api/withdraw', 'withdrawController.create')
Route.post('/api/mpesa/withdraw', 'MpesaController.initiateWithdrawal')
Route.post('/api/callback', 'CallbackController.handleCallback')

// Add the new route for Mpesa withdrawal
Route.post('/api/mpesa/withdraw', 'MpesaController.initiateWithdrawal')

const Event = use('Event')

Route.group(() => {
  Route.post('register', 'AuthController.register').middleware('throttle:10,60')
  Route.post('login', 'AuthController.login').middleware('throttle:10,60')
  Route.get('user', 'AuthController.user').middleware('auth')
  Route.post('social', 'SocialController.handler')
}).prefix('api/v1/auth')

Route.group(() => {
  Route.put('profile', 'ProfileController.update')
  Route.post('freebie', 'FreebieController.store')
  Route.get('freebie', 'FreebieController.status')
  Route.post('promocode/using', 'PromocodeController.using')
})
  .prefix('api/v1')
  .middleware(['auth', 'throttle:10,60'])

Route.group(() => {
  Route.get('confirmation', 'ProfileController.confirmation')
}).prefix('api/v1/user')

Route.get('/api/users', 'UserController.index')
Route.get('/get-mpesa-token', 'MpesaController.getAccessToken')

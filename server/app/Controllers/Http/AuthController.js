'use strict'

const User = use('App/Models/User')
const Event = use('Event')

const { validateAll } = use('Validator')

class AuthController {
  async register({ request, auth, response }) {
    const rules = {
      phone_no: 'required|regex:^[0-9]{10}$|unique:users,phone_no',
      username: 'required|unique:users,username',
      password: 'required|confirmed|min:6',
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).send(validation.messages())
    }
    const userData = request.only(['username', 'phone_no', 'password'])

    try {
      const user = await User.create(userData)
      const token = await auth.generate(user)

      Event.fire('user::register', user)

      return response.json({
        status: 'success',
        message: 'Registration Succesful',
        data: token,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem creating the user, please try again.',
        debug: error,
      })
    }
  }

  async login({ request, auth, response }) {
    const { phone_no, password } = request.only(['phone_no', 'password'])

    try {
      const token = await auth.attempt(phone_no, password)

      return response.json({
        status: 'success',
        message: 'Login Succesful',
        data: token,
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Invalid number/password.',
      })
    }
  }

  async user({ auth, response }) {
    const user = await auth.getUser()
    return response.json({
      status: 'success',
      data: {
        user: await User.query()
          .where('id', user.id)
          .with('socials')
          .setVisible([
            'id',
            'first_name',
            'last_name',
            'fullname',
            'username',
            'email',
            'avatar',
            'balance',
            'balance_demo',
            'phone_no',
          ])
          .first(),
      },
    })
  }
}

module.exports = AuthController

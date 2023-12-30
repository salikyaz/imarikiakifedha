'use strict'

const Database = use('Database')

class UserController {
  async index({ response }) {
    try {
      const users = await Database.table('users').select(
        'id',
        'username',
        'first_name',
        'last_name',
        'balance',
        'created_at',
        'updated_at',
        'phone_no'
      )
      return response.json(users)
    } catch (error) {
      return response.status(500).send('Error fetching users')
    }
  }
}

module.exports = UserController

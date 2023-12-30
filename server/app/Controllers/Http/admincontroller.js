// start/routes.js
Route.post('/api/admin/login', 'AdminController.login')

// app/Controllers/Http/AdminController.js
;('use strict')

const Database = use('Database')

class AdminController {
  async login({ request, auth, response }) {
    const { phone_no, password } = request.only(['phone_no', 'password'])

    try {
      const user = await Database.from('registration')
        .where('phone_no', phone_no)
        .andWhere('password', password)
        .first()

      if (user) {
        // Generate and return a token upon successful login
        const token = await auth.attempt(phone_no, password)
        return response.json({ token })
      } else {
        return response.status(401).json({ error: 'Invalid credentials' })
      }
    } catch (error) {
      console.error('Login failed:', error)
      return response.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

module.exports = AdminController

// app/Controllers/Http/MpesaController.js

'use strict'

const axios = require('axios')

class MpesaController {
  async getAccessToken({ response }) {
    try {
      const clientId = 'KNpAtsVAjL8AmN1CTQhYvOA66sk5WoGY'
      const clientSecret = 'S0zLQw0k6hPAtTA4'
      const authString =
        'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')

      const mpesaResponse = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: authString,
          },
        }
      )

      return response.json(mpesaResponse.data)
    } catch (error) {
      console.error('Error obtaining access token:', error.message)
      return response.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

module.exports = MpesaController

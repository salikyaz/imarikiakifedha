// app/Controllers/Http/CallbackController.js

'use strict'

const axios = require('axios')

class CallbackController {
  async handleCallback({ request, response }) {
    try {
      const { Body, Authorization } = request.only(['Body', 'Authorization'])
      const { stkCallback } = Body

      // Obtain the access token dynamically from MpesaController
      const accessTokenResponse = await axios.get(
        'http://localhost:3333/api/get-access-token'
      )
      const expectedToken = accessTokenResponse.data.access_token

      // Verify the token
      if (Authorization !== expectedToken) {
        return response.status(401).json({ error: 'Unauthorized' })
      }

      // Extract relevant information from the callback
      const { ResultCode, ResultDesc, CallbackMetadata } = stkCallback

      // Check if the payment was successful (ResultCode === 0)
      if (ResultCode === 0) {
        const { MpesaReceiptNumber, Amount, TransactionDate, PhoneNumber } =
          CallbackMetadata.Item

        // For demonstration purposes, using a local Nuxt server for development
        const frontendUrl = 'http://localhost:3000' // Update with your Nuxt frontend URL

        const frontendResponse = await axios.post(
          `${frontendUrl}/api/notify-deposit`,
          {
            status: 'success',
            amount: Amount,
            receiptNumber: MpesaReceiptNumber,
            // Add more data as needed
          }
        )

        console.log('Frontend Response:', frontendResponse.data)
      } else {
        // Log the unsuccessful payment details
        console.error('Payment Unsuccessful:')
        console.error('Result Code:', ResultCode)
        console.error('Result Description:', ResultDesc)

        // For unsuccessful payments, you can also notify the frontend
        const frontendResponse = await axios.post(
          'http://localhost:3000/api/notify-deposit', // Update with your Nuxt frontend URL
          {
            status: 'failure',
            error: ResultDesc,
            // Add more data as needed
          }
        )

        console.log('Frontend Response:', frontendResponse.data)
      }

      // Return a response to M-Pesa (you can customize this based on your requirements)
      return response.json({ message: 'Callback received successfully' })
    } catch (error) {
      // Handle errors and return a generic error response to M-Pesa
      console.error('Error handling callback:', error.message)
      console.error(error)
      return response.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

module.exports = CallbackController

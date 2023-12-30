// 'use strict'

// const axios = require('axios')

// class withdrawController {
//   async create({ request, response }) {
//     try {
//       // Get necessary data from the request
//       const { amount, mpesaNo, accessToken } = request.only([
//         'amount',
//         'mpesaNo',
//         'accessToken',
//       ])

//       // Log incoming deposit request data
//       console.log('Incoming Withdraw Request:', { amount, mpesaNo })

//       // Check if the access token is available
//       if (!accessToken) {
//         console.error('Access token not available. Unable to initiate deposit.')
//         return response.status(400).json({ error: 'Invalid Access Token' })
//       }

//       // M-Pesa API endpoint for STK push
//       const mpesaApiUrl =
//         'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest'

//       // Request headers
//       const headers = {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       }

//       // Request body for STK push
//       const requestBody = {
//         InitiatorName: 'testapi',
//         SecurityCredential:
//           'EsJocK7+NjqZPC3I3EO+TbvS+xVb9TymWwaKABoaZr/Z/n0UysSs..',
//         CommandID: 'BusinessPayment',
//         Amount: amount,
//         PartyA: '600996',
//         PartyB: mpesaNo,
//         Remarks: 'here are my remarks',
//         QueueTimeOutURL: 'https://mydomain.com/b2c/queue',
//         ResultURL: 'https://mydomain.com/b2c/result',
//         Occasion: 'Christmas',
//       }

//       // Log the STK push request data
//       console.log('Withdrawal request:', requestBody)

//       // Make the deposit request
//       const mpesaResponse = await axios.post(mpesaApiUrl, requestBody, {
//         headers,
//       })

//       // Log the STK push response
//       console.log('Withdrawal request:', mpesaResponse.data)

//       // Return the response to the client
//       return response.json(mpesaResponse.data)
//     } catch (error) {
//       // Log detailed error information
//       console.error('Error withdrawal:', error.message)
//       console.error(error)

//       // Check if the error is due to an invalid access token
//       if (
//         error.response &&
//         error.response.status === 404 &&
//         error.response.data.errorCode === '404.001.03'
//       ) {
//         return response.status(401).json({ error: 'Invalid Access Token' })
//       }

//       // Return a generic error response to the client
//       return response.status(500).json({ error: 'Internal Server Error' })
//     }
//   }
// }

// module.exports = withdrawController

'use strict'

const User = use('App/Models/User')
const axios = require('axios')

class WithdrawController {
  async create({ request, response }) {
    try {
      // Get necessary data from the request
      const { amount, mpesaNo, accessToken } = request.only([
        'amount',
        'mpesaNo',
        'accessToken',
      ])

      // Log incoming withdrawal request data
      console.log('Incoming Withdrawal Request:', { amount, mpesaNo })

      // Check if the access token is available
      if (!accessToken) {
        console.error(
          'Access token not available. Unable to initiate withdrawal.'
        )
        return response.status(400).json({ error: 'Invalid Access Token' })
      }

      // Validate the amount (assuming it's a positive number)
      if (isNaN(amount) || amount <= 0) {
        console.error('Invalid amount. Amount must be a positive number.')
        return response.status(400).json({ error: 'Invalid Amount' })
      }

      // Fetch the user's information including the balance
      const user = await User.findBy('phone_no', mpesaNo)
      if (!user) {
        console.error(
          `User with phone number ${mpesaNo} not found in the database`
        )
        return response.status(404).json({ error: 'User not found' })
      }

      // Check if the user has sufficient balance
      if (user.balance < amount) {
        console.error('Insufficient balance. Unable to initiate withdrawal.')
        return response.status(400).json({ error: 'Insufficient Balance' })
      }

      // Deduct the amount from the user's balance
      user.balance -= amount
      await user.save()

      // M-Pesa API endpoint for STK push
      const mpesaApiUrl =
        'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest'

      // Request headers
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }

      // Request body for STK push
      const requestBody = {
        InitiatorName: 'testapi',
        SecurityCredential:
          'EsJocK7+NjqZPC3I3EO+TbvS+xVb9TymWwaKABoaZr/Z/n0UysSs..',
        CommandID: 'BusinessPayment',
        Amount: amount,
        PartyA: '600996',
        PartyB: mpesaNo,
        Remarks: 'here are my remarks',
        QueueTimeOutURL: 'https://mydomain.com/b2c/queue',
        ResultURL: 'https://mydomain.com/b2c/result',
        Occasion: 'Christmas',
      }

      // Log the STK push request data
      console.log('Withdrawal request:', requestBody)

      // Make the withdrawal request
      const mpesaResponse = await axios.post(mpesaApiUrl, requestBody, {
        headers,
      })

      // Log the STK push response
      console.log('Withdrawal request:', mpesaResponse.data)

      // Return the response to the client
      return response.json(mpesaResponse.data)
    } catch (error) {
      // Log detailed error information
      console.error('Error withdrawal:', error.message)
      console.error(error)

      // Check if the error is due to an invalid access token
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data.errorCode === '404.001.03'
      ) {
        return response.status(401).json({ error: 'Invalid Access Token' })
      }

      // Return a generic error response to the client
      return response.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

module.exports = WithdrawController

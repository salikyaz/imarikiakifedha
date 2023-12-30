'use strict'
const User = use('App/Models/User')

const axios = require('axios')

class DepositController {
  async create({ request, response }) {
    try {
      // Get necessary data from the request
      const { amount, mpesaNo, accessToken } = request.only([
        'amount',
        'mpesaNo',
        'accessToken',
      ])

      // Log incoming deposit request data
      console.log('Incoming Deposit Request:', { amount, mpesaNo })

      // Check if the access token is available
      if (!accessToken) {
        console.error('Access token not available. Unable to initiate deposit.')
        return response.status(400).json({ error: 'Invalid Access Token' })
      }

      // M-Pesa API endpoint for STK push
      const mpesaApiUrl =
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

      // Request headers
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }

      // Request body for STK push
      const requestBody = {
        BusinessShortCode: '174379',
        Password:
          'MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3',
        Timestamp: '20160216165627',
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: mpesaNo,
        PartyB: '174379',
        PhoneNumber: mpesaNo,
        CallBackURL: 'https://your-domain.com/api/callback',
        AccountReference: 'Test',
        TransactionDesc: 'Test',
      }

      // Log the STK push request data
      console.log('STK Push Request:', requestBody)

      // Make the deposit request
      const mpesaResponse = await axios.post(mpesaApiUrl, requestBody, {
        headers,
      })

      // Log the STK push response
      console.log('STK Push Response:', mpesaResponse.data)

      const user = await User.findBy('phone_no', mpesaNo)
      if (user) {
        user.balance = parseFloat(user.balance) + parseFloat(amount)
        await user.save()
      } else {
        console.error(
          `User with phone number ${mpesaNo} not found in the database`
        )
      } //edited code

      // Return the response to the client
      return response.json(mpesaResponse.data)
    } catch (error) {
      // Log detailed error information
      console.error('Error depositing:', error.message)
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

module.exports = DepositController

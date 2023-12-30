<!-- pages/index.vue -->

<template>
  <div class="deposit-page">
    <h1><b> Deposit </b></h1>
    <form @submit.prevent="handleDeposit" class="deposit-form">
      <label for="amount">Amount:</label>
      <input
        type="text"
        id="amount"
        v-model="amount"
        required
        placeholder="Enter Amount"
      />

      <label for="mpesaNo">M-Pesa Number:</label>
      <input
        type="text"
        id="mpesaNo"
        v-model="mpesaNo"
        required
        placeholder="Enter Mpesa No"
      />

      <button type="submit" class="deposit-btn">Deposit</button>

      <div v-if="depositApiResponse && depositApiResponse.status === 'success'">
        <h2>Authorization Successful</h2>
        <p>Amount: {{ depositApiResponse.amount }}</p>
      </div>

      <div v-if="depositApiResponse && depositApiResponse.status === 'failure'">
        <h2>Authorization Failed</h2>
        <p>Error: {{ depositApiResponse.error }}</p>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      amount: '',
      mpesaNo: '',
      accessToken: '',
      depositApiResponse: null,
    }
  },
  methods: {
    async initiateOAuth() {
      try {
        const response = await this.$axios.get(
          'http://localhost:3333/get-mpesa-token'
        )
        if (response.data && response.data.access_token) {
          this.accessToken = response.data.access_token
          console.log('Access Token:', this.accessToken)
        } else {
          console.error(
            'Access token not available. Unable to initiate deposit.'
          )
        }
      } catch (error) {
        console.error('Error obtaining access token:', error.message)
      }
    },
    async handleDeposit() {
      try {
        if (!this.accessToken) {
          console.error(
            'Access token not available. Unable to initiate deposit.'
          )
          return
        }

        const requestBody = {
          amount: this.amount,
          mpesaNo: this.mpesaNo,
          accessToken: this.accessToken,
        }

        const response = await this.$axios.post(
          'http://localhost:3333/api/deposit',
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        console.log('Complete Deposit Response:', response)
        console.log('Deposit Data:', response.data)

        this.depositApiResponse = response.data
        console.log('Deposit response:', this.depositApiResponse)
        // Handle the response as needed
      } catch (error) {
        console.error('Error depositing:', error.message)
        // Handle errors
      }
    },
  },
  beforeMount() {
    this.initiateOAuth()
  },
}
</script>

<style scoped>
.deposit-page {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.deposit-form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-weight: bold;
}

input {
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.deposit-btn,
.withdraw-btn {
  background-color: #ffb200;
  font-weight: bold;
  color: rgb(0, 0, 0);
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 8px;
}

.deposit-btn:hover,
.withdraw-btn:hover {
  background-color: #ffb200;
}
h1 {
  text-align: center;
  font-size: 20px;
  margin-bottom: 30px;
}
</style>

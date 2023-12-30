<template>
  <div class="withdraw-page">
    <h1><b> Withdraw </b></h1>

    <form @submit.prevent="handlewithdraw" class="withdraw-form">
      <div class="tax">
        <h2>Withholding Tax Notice:</h2>
        <p>
          As provided by the Income Tax Act, Cap 472, all gaming companies are
          required to withhold winnings at a rate of 20%. This is the
          <b>Withholding Tax </b>. In compilance with the law, ImarikaKifedha
          will deduct and remit to KRA 20% of all winnings.
        </p>
      </div>

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

      <button type="submit" class="withdraw-btn">Withdraw</button>
      <br />
      <h3><b>Withdrawable Amount:</b></h3>

      <!-- Display withdrawal fee and withholding tax information to the user -->
      <table v-if="showFeeAndTax">
        <tr>
          <td>Withdrawal Fee (10%):</td>
          <td>{{ withdrawalFee.toFixed(2) }}</td>
        </tr>
        <tr>
          <td>Withholding Tax (20%):</td>
          <td>{{ withholdingTax.toFixed(2) }}</td>
        </tr>
        <tr>
          <td>Actual Amount after Deduction:</td>
          <td>{{ actualAmountAfterDeduction.toFixed(2) }}</td>
        </tr>
      </table>
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
      showFeeAndTax: false,
      withdrawalFee: 0,
      withholdingTax: 0,
      actualAmountAfterDeduction: 0,
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
    async handlewithdraw() {
      try {
        if (!this.accessToken) {
          console.error(
            'Access token not available. Unable to initiate deposit.'
          )
          return
        }

        // Calculate withdrawal fee (10%) and withholding tax (20%)
        this.withdrawalFee = 0.1 * parseFloat(this.amount)
        this.withholdingTax = 0.2 * parseFloat(this.amount)
        this.actualAmountAfterDeduction =
          parseFloat(this.amount) - this.withdrawalFee - this.withholdingTax

        // Display withdrawal fee and withholding tax information
        this.showFeeAndTax = true

        const requestBody = {
          amount: this.actualAmountAfterDeduction.toFixed(2),
          mpesaNo: this.mpesaNo,
          accessToken: this.accessToken,
        }

        const response = await this.$axios.post(
          'http://localhost:3333/api/withdraw',
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        console.log('Complete Withdraw Response:', response)
        console.log('Withdraw Data:', response.data)
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
td {
  font-weight: bold;
}
.withdraw-page {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.withdraw-form {
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

.withdraw-btn {
  background-color: #ffb200;
  color: rgb(0, 0, 0);
  font-weight: bold;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 8px;
}

.withdraw-btn:hover {
  background-color: #ffb200;
}
h1 {
  text-align: center;
  font-size: 20px;
}
p {
  margin-right: 5px;
  border: 1px;
  border-color: black;
}

.tax {
  text-align: justify;
  border: 2px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  margin: 20px 0;
}

.tax h2 {
  margin-bottom: 10px;
  font-weight: bold;
}
</style>

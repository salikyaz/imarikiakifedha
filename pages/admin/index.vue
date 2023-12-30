<template>
  <div class="admin-login">
    <h1 class="heading">
      <b>IMARIKA KIFEDHA</b>
    </h1>

    <h1 class="login-heading">
      <b>Admin Panel </b>
    </h1>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="text" id="email" v-model="email" required />
        <div v-if="emailError" class="error-message">{{ emailError }}</div>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
        <div v-if="passwordError" class="error-message">
          {{ passwordError }}
        </div>
      </div>

      <button type="submit" class="login-button"><b>Login</b></button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
    }
  },
  methods: {
    login() {
      // Hardcoded email validation using a simple regular expression
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailRegex.test(this.email)) {
        this.emailError = 'Please enter a valid email address.'
        return // Prevent form submission if email is invalid
      } else {
        this.emailError = '' // Reset email error on valid email
      }

      // Hardcoded password validation
      if (this.password.length < 6) {
        this.passwordError = 'Password must be at least 6 characters.'
        return // Prevent form submission if password is invalid
      } else {
        this.passwordError = '' // Reset password error on valid password
      }

      // Your existing login logic here

      // Open the specified page when login is successful
      this.$router.push('/admin/data')
    },
  },
}
</script>

<style scoped>
.heading {
  margin-top: 60px;
  font-size: 20px;
  font-family: Lucida Handwriting;
  text-align: center;
}
.admin-login {
  max-width: 300px;
  margin: auto;
  height: 50%;
  padding: 20px;

  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-heading {
  margin-top: 10px;
  text-align: center;
  color: black;
  margin-bottom: 20px;
  font-family: Monaco;
  font-size: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

.login-button {
  background-color: #ff9500;
  color: #000;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error-message {
  color: #ff0000;
  margin-top: 5px;
}
</style>

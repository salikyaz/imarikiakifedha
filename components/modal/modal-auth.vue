<template>
  <t-modal :click-to-close="false" name="auth">
    <template #header>
      <h3>Login</h3>
    </template>

    <form class="grid grid-cols-1 gap-5" @submit.prevent="login">
      <div class="relative">
        <t-input
          v-model="user.phone_no"
          class="!pl-12"
          type="tel"
          variant="strong"
          placeholder="Enter Mpesa Number"
        ></t-input>
        <img
          class="absolute transform -translate-y-1/2 top-1/2 left-4"
          src="/img/icon/user.svg"
          alt=""
        />
      </div>
      <div class="relative">
        <t-input
          v-model="user.password"
          class="!pl-12"
          variant="strong"
          type="password"
          placeholder="Password"
        ></t-input>
        <img
          class="absolute top-4 left-4"
          src="/img/icon/password.svg"
          alt=""
        />
        <button
          type="button"
          class="block mt-1 ml-auto text-xs font-semibold leading-none text-right text-primary"
        >
          Forgot your password?
        </button>
      </div>
      <div class="grid grid-cols-1 gap-3">
        <t-button type="submit" variant="primary">
          <div class="flex items-center justify-center py-2">
            <span>Login to account</span>
            <img class="ml-2" src="/img/icon/next.svg" alt="" />
          </div>
        </t-button>
        <button
          type="button"
          class="font-semibold text-primary"
          @click="showRegister"
        >
          Create an account
        </button>
      </div>
    </form>
  </t-modal>
</template>

<script>
import sectionSocial from './section-social.vue'
export default {
  components: { sectionSocial },
  data() {
    return {
      user: {
        phone_no: '',
        password: '',
      },
    }
  },
  methods: {
    async login() {
      await this.$auth.loginWith('local', { data: this.user })
      if (this.$auth.loggedIn) {
        this.$modal.hide('auth')
      }
    },
    showRegister() {
      this.$modal.hide('auth')
      this.$modal.show('register')
    },
  },
}
</script>

<style></style>

<template>
  <section class="container">
    <modal-crash-instruction />
    <h1 class="flex items-center mb-6 text-2xl font-black uppercase">
      <span class="flex-1"> CRASH GAME</span>
      <t-button variant="white" @click="$modal.show('crash-instruction')">
        <svg class="w-4 h-6">
          <use xlink:href="/img/icon/free/sprite.svg#info-i"></use>
        </svg>
      </t-button>
    </h1>
    <div class="grid grid-cols-8 gap-1.5">
      <div class="col-span-8 p-12 bg-white lg:col-span-3 rounded-xl">
        <form class="flex flex-col" @submit.prevent="betPlace">
          <label class="mb-3 font-semibold text-md" for="amount">{{
            $t('bet-amount')
          }}</label>
          <div class="mb-3 relative">
            <t-input id="amount" v-model="bet.amount"></t-input>
            <div
              class="absolute top-1/2 right-3 transform -translate-y-1/2 space-x-2 flex items-center"
            >
              <!-- <t-button
                type="button"
                variant="outline"
                class="bg-gray-100 border-none w-10"
                @click="bet.amount *= 2"
                >X2</t-button
              >
              <t-button
                type="button"
                variant="outline"
                class="bg-gray-100 border-none w-10"
                @click="bet.amount /= 2"
                >1/2</t-button
              > -->
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2 mb-4 sm:grid-cols-6">
            <!-- <t-button type="button" variant="outline" @click="bet.amount += 1"
              >+1</t-button
            >
            <t-button type="button" variant="outline" @click="bet.amount += 5"
              >+5</t-button
            >
            <t-button type="button" variant="outline" @click="bet.amount += 10"
              >+10</t-button
            >
            <t-button type="button" variant="outline" @click="bet.amount += 100"
              >+100</t-button
            >
            <t-button type="button" variant="outline" @click="bet.amount += 500"
              >+500</t-button
            >
            <t-button
              type="button"
              variant="outline"
              @click="bet.amount += 100000"
              >Все</t-button
            > -->
          </div>
          <label class="mb-3 font-semibold text-md" for="auto">{{
            $t('autocashout')
          }}</label>
          <t-input
            id="auto"
            v-model="bet.rate_auto"
            class="mb-4"
            :placeholder="$t('rate')"
          ></t-input>
          <hr class="mt-0 mb-4 divider" />
          <t-button
            v-tooltip="{
              content: !userBet && rate > 1 ? $t('game-started') : '',
            }"
            :disabled="(rate > 1 && !userBet) || (userBet && rate === 1)"
            type="submit"
            class="!py-4"
            variant="primary"
            >{{ btnText }}</t-button
          >
        </form>
      </div>

      <div class="col-span-8 lg:col-span-5">
        <div class="px-8 py-6 bg-white rounded-xl">
          <crash-chart :socket="socket" />
        </div>
      </div>
      <div class="col-span-8">
        <div class="chat-container">
          <h1 class="h1"><b> Chat Box </b></h1>

          <div class="chat-messages">
            <div
              v-for="message in chatMessages"
              :key="message.id"
              class="chat-message"
            >
              <span class="sender">{{ message.sender }}:</span>
              {{ message.text }}
            </div>
          </div>
          <form @submit.prevent="sendMessage" class="chat-form">
            <t-input
              v-model="newMessage"
              placeholder="Type your message"
              class="message-input"
            ></t-input>
            <t-button type="submit" variant="primary" class="send-button"
              >Send</t-button
            >
          </form>
        </div>
      </div>
      <div class="col-span-8">
        <crash-table :socket="socket" />
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Vue from 'vue'
import crashChart from '~/components/games/crash/crash-chart.vue'
import crashTable from '~/components/games/crash/crash-table.vue'
import ModalCrashInstruction from '~/components/modal/crash/modal-crash-instruction.vue'

const eventBus = new Vue() // Global event bus
export default {
  components: { crashChart, crashTable, ModalCrashInstruction },
  data() {
    return {
      chatMessages: [],
      newMessage: '',

      bet: {
        amount: 0,
        rate_auto: null,
      },
      socket: null,
    }
  },

  computed: {
    ...mapState({
      rate: (state) => state.crash.rate,
    }),
    ...mapGetters({
      bets: 'crash/bets',
    }),
    userBet() {
      if (!this.$auth.loggedIn) return false
      return this.bets.find(
        (bet) => bet.user.id === this.$auth.user.id && bet.status === 'await'
      )
    },
    btnText() {
      if (this.userBet && this.rate === 1) {
        return this.$t('await-start')
      }
      return this.userBet && this.rate > 1
        ? this.$t('Good Luck...')
        : this.$t('Play')
    },
  },
  watch: {
    'bet.amount'(val) {
      if (val < 0) {
        this.bet.amount = 0
      } else if (this.$auth.loggedIn && val > this.$auth.user?.balance) {
        this.bet.amount = this.$auth.user.balance
      }
    },
  },
  beforeMount() {
    this.socket = this.$nuxtSocket({
      channel: 'crash',
      extraHeaders: {
        Authorization: this.$auth.strategy.token.get(),
      },
    })
    this.socket.emit('game:status')
  },
  created() {
    // Listen for chat messages from the event bus
    eventBus.$on('chat-message', (message) => {
      this.addChatMessage(message)
    })
  },

  methods: {
    sendMessage() {
      if (this.$auth.loggedIn && this.newMessage.trim() !== '') {
        const message = {
          id: Date.now(),
          sender: this.$auth.user.username,
          text: this.newMessage.trim(),
        }

        // Broadcast the chat message to all users through the event bus
        eventBus.$emit('chat-message', message)

        // Clear the input field
        this.newMessage = ''
      }
    },

    addChatMessage(message) {
      this.chatMessages.push(message)

      // Keep only the last 50 messages
      if (this.chatMessages.length > 50) {
        this.chatMessages.shift()
      }
    },

    betPlace() {
      if (!this.$auth.loggedIn) {
        return this.$modal.show('auth')
      }
      if (this.rate > 1 && this.userBet) {
        return this.socket.emit('bet:take')
      }
      if (this.$auth.user.balance === 0) {
        this.$notify(
          {
            group: 'default',
            type: 'error',
            text: 'Insufficient funds',
          },
          4000
        )
      }
      this.socket.emit('bet:make', this.bet, async (data) => {
        this.$notify(
          {
            group: 'default',
            type: data.status,
            text: data.message,
          },
          4000
        )
        if (data.status === 'success') {
          await this.$auth.fetchUser()
        }
      })
    },
  },
}
</script>
<style scoped>
/* Scoped styles for the component */

.h1 {
  text-align: center;
  font-size: 20px;
}
.chat-container {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
}

.chat-messages {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.chat-message {
  margin-bottom: 8px;
}

.sender {
  font-weight: bold;
  margin-right: 5px;
}

.chat-form {
  display: flex;
  align-items: center;
}

.message-input {
  flex: 1;
  margin-right: 10px;
}

.send-button {
  width: 80px;
}
</style>

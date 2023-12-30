<template>
  <section class="container">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <!-- <card-game disabled name="IMARIKA Football Game" class="lg:col-span-2" /> -->
      <!--    <card-game disabled name="PvP"></card-game>-->
      <card-game
        name="IMARIKA Crash Game"
        :to="{ name: 'games-crash' }"
      ></card-game>
      <card-game
        name="IMARIKA Football Game"
        :to="{ name: 'games-matches' }"
      ></card-game>
      <!-- <card-game disabled name="CoinFlip"></card-game>  -->
    </div>
  </section>
</template>

<script>
import cardGame from '~/components/card/card-game.vue'
export default {
  components: { cardGame },
}
</script>

<style></style>

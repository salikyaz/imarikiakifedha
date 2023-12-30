<template>
  <div>
    <div class="centered-text">
      <h1><b>IMARIKA KIFEDHA</b></h1>
      <h1>Football Matches</h1>
    </div>
    <div v-for="match in matches.slice(0, 10)" :key="match.match_id">
      <div class="match-container">
        <div class="match-card">
          <!-- Match card content (same as your existing code) -->
          <div class="team">
            <img :src="match.team_1.logo" alt="Team 1 Logo" />
            <span>{{ match.team_1.name }}</span>
            <div class="country">{{ match.team_1.country }}</div>
          </div>
          <div class="score">
            {{ match.score.full_time.team_1 }} -
            {{ match.score.full_time.team_2 }}
          </div>
          <div class="team">
            <img :src="match.team_2.logo" alt="Team 2 Logo" />
            <span>{{ match.team_2.name }}</span>
            <div class="country">{{ match.team_2.country }}</div>
          </div>
          <div class="status">
            {{ match.status }} <i><b>Minutes</b> </i>
          </div>
          <button class="bet-button" @click="placeBet(match)">
            <B> Play </B>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      matches: [],
    }
  },
  mounted() {
    this.fetchMatches()
  },
  methods: {
    async fetchMatches() {
      const url =
        'https://livescore-football.p.rapidapi.com/soccer/live-matches?timezone_utc=7%3A00'
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':
            'e7754367f9msh09a0b406dbd1dd5p1a8e47jsn744702e35851',
          'X-RapidAPI-Host': 'livescore-football.p.rapidapi.com',
        },
      }

      try {
        const response = await fetch(url, options)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        // Assuming the data structure is { "data": [{ "matches": [...] }] }
        this.matches = data.data[0].matches
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    placeBet(match) {
      // Implement your logic for placing a bet for the selected match
      console.log(`Betting on match ${match.match_id}`)
      const alertMessage =
        'Network Error. Check your internet connection and try again'
      alert(alertMessage)
    },
  },
}
</script>

<style scoped>
.centered-text {
  text-align: center;
  font-size: 30px;
}
.match-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.match-card {
  width: 300px;
  margin: 10px;
  border: 1px solid #ddd;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.team {
  text-align: center;
}

.team img {
  max-width: 50px;
  max-height: 50px;
  display: inline;
}

.country {
  font-size: 0.8em;
  color: #888;
}

.score {
  font-weight: bold;
  font-size: 1.2em;
  display: inline;
  margin-left: 125px;
  margin-bottom: 100px;
  margin-top: 100px;
}

.status {
  font-style: italic;
}

.bet-button {
  margin-top: 10px;
  width: 100%;
  padding: 5px;
  background-color: #ff9500;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.bet-button:hover {
  background-color: #ff9500;
}
</style>

<template>
  <div>
    <h1><b>User Data</b></h1>

    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Balance</th>
          <th>MPesa Number</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.balance }}</td>
          <td>{{ user.phone_no }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        <b>Previous</b>
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        <b>Next</b>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      itemsPerPage: 30,
      currentPage: 1,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.users.length / this.itemsPerPage)
    },
    paginatedUsers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.users.slice(startIndex, endIndex)
    },
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1
      }
    },
  },
  async fetch() {
    try {
      const response = await fetch('http://localhost:3333/api/users')
      const data = await response.json()

      // Sort users by 'created_at' in descending order
      this.users = data.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at)
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  },
}
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 20px;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.user-table th,
.user-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.user-table th {
  background-color: #f2f2f2;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination button {
  padding: 8px;
  cursor: pointer;
  background-color: #ff9500;
  color: black;
  border: none;
  border-radius: 4px;
}

.pagination button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.pagination span {
  font-size: 14px;
}
</style>

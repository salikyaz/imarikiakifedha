<template>
  <div>
    <a href="/Deposit"
      ><button class="styled-button primary-button">Deposit</button>
    </a>
    <a href="/Withdrawal">
      <button class="styled-button secondary-button">Withdraw</button>
    </a>
  </div>
</template>

<style>
.styled-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  transition: background-color 0.3s;
}

.primary-button {
  background-color: #ffb200;
  color: #0c0c0c;
  font-weight: bold;
}

.secondary-button {
  background-color: #ffb200;
  color: #0c0c0c;
  font-weight: bold;
}

.styled-button:hover {
  background-color: darken(#ffb200, 10%);
}
div {
  text-align: center;
}
</style>

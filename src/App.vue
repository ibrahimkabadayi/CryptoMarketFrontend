<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { marketApi } from './api/market';
import type { Coin } from './types/market';

const coins = ref<Coin[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    coins.value = await marketApi.getAllCoins();
  } catch (error) {
    console.error("Veriler çekilemedi:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <main class="dashboard">
    <h1>Canlı Kripto Piyasası</h1>

    <div v-if="isLoading" class="loading">
      Piyasa verileri yükleniyor...
    </div>

    <div v-else class="coin-grid">
      <div v-for="coin in coins" :key="coin.symbol" class="coin-card">
        <div class="coin-header">
          <h2>{{ coin.name }}</h2>
          <span class="symbol">{{ coin.symbol }}</span>
        </div>
        <div class="coin-price">
          ${{ coin.price }}
        </div>
        <div class="coin-marketcap">
          Hacim: ${{ coin.market_cap }}
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #121212;
  color: #e0e0e0;
  margin: 0;
  padding: 2rem;
}

.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #fff;
  border-bottom: 2px solid #333;
  padding-bottom: 10px;
}

.coin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.coin-card {
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 1.5rem;
  transition: transform 0.2s;
}

.coin-card:hover {
  transform: translateY(-5px);
  border-color: #f3ba2f; /* Binance sarısı detayı */
}

.coin-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
}

.coin-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.symbol {
  background-color: #333;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #aaa;
}

.coin-price {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 0.5rem;
}

.coin-marketcap {
  font-size: 0.9rem;
  color: #888;
}

.loading {
  font-size: 1.2rem;
  color: #f3ba2f;
  margin-top: 2rem;
}

</style>

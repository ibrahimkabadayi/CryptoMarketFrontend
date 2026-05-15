<script setup lang="ts">
import {marketApi} from "@/api/market";
import {computed, onMounted, ref} from "vue";
import {signalRService} from "@/api/signalR";
import type {Coin, PriceUpdateMessage} from "@/types/market";
import CoinTable from "@/components/market/CoinTable.vue";

const coins = ref<Coin[]>();
const isLoading = ref(true);
const errorMessage = ref("");
const searchQuery = ref("");

const getCoins = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try
  {
    coins.value = await marketApi.getAllCoins();
  }
  catch (error)
  {
    console.error("Failed to fetch market data:", error);
    errorMessage.value = "Could not connect to the market server. Please try again later.";
  }
  finally
  {
    isLoading.value = false;
  }
}

const filteredCoins = computed(() =>
{
  if (!coins.value) return [];
  if (!searchQuery.value.trim()) return coins.value;
  const query = searchQuery.value.toLowerCase();
  return coins.value.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.symbol.toLowerCase().includes(query)
  );
});

const totalCoins = computed(() => coins.value?.length ?? 0);

const topGainer = computed(() =>
{
  if (!coins.value || coins.value.length === 0) return null;
  return coins.value.reduce((a, b) => a.currentPrice > b.currentPrice ? a : b);
});

const buyCoin = (coin: Coin) => {
  console.log("The coin that wanted to be bought:", coin.name, coin.currentPrice);
}

onMounted(() => {
  getCoins();

  signalRService.startConnection('/hubs/market');

  signalRService.on('ReceivePriceUpdate', (updateInfo : PriceUpdateMessage) =>
  {
    if (coins.value)
    {
      const coinToUpdate = coins.value.find(x => x.symbol == updateInfo.symbol);

      if (coinToUpdate)
      {
        coinToUpdate.currentPrice = updateInfo.price;
        console.log(`${updateInfo.symbol} new price: $${updateInfo.price}`);
      }
    }
  })
})

</script>

<template>

  <div class="min-h-screen text-white p-6 md:p-8">
    <div class="max-w-7xl mx-auto">

      <!-- Page Header -->
      <div class="mb-8 animate-fade-in-up">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          <span class="gradient-text">Cryptocurrency</span> Market
        </h1>
        <p style="color: var(--text-secondary)" class="text-base">
          Track real-time prices and make informed trading decisions
        </p>
      </div>

      <!-- Stats Row + Search -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in-up animate-delay-1" v-if="!isLoading && !errorMessage">

        <!-- Total Coins -->
        <div class="glass-card p-5 flex items-center space-x-4">
          <div class="stat-icon-box" style="background: rgba(99, 102, 241, 0.12);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" style="color: var(--accent-3);">
              <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z"/>
            </svg>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider" style="color: var(--text-muted);">Total Coins</p>
            <p class="text-2xl font-bold" style="color: var(--text-primary);">{{ totalCoins }}</p>
          </div>
        </div>

        <!-- Top Coin -->
        <div class="glass-card p-5 flex items-center space-x-4" v-if="topGainer">
          <div class="stat-icon-box" style="background: rgba(16, 185, 129, 0.12);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" style="color: #34d399;">
              <path fill-rule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider" style="color: var(--text-muted);">Highest Price</p>
            <p class="text-2xl font-bold" style="color: #34d399;">{{ topGainer.symbol }}</p>
          </div>
        </div>

        <!-- Search -->
        <div class="glass-card p-5 flex items-center">
          <div class="relative w-full">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd"/>
            </svg>
            <input
                v-model="searchQuery"
                type="text"
                id="market-search"
                placeholder="Search coins..."
                class="input-glass w-full"
                style="padding-left: 36px; padding-top: 10px; padding-bottom: 10px; font-size: 0.875rem;"
            >
          </div>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="animate-fade-in-up">
        <div class="glass-card-static overflow-hidden">
          <!-- Skeleton header -->
          <div class="p-5 flex items-center space-x-4" style="border-bottom: 1px solid var(--border-subtle);">
            <div class="shimmer" style="width: 100px; height: 14px;"></div>
          </div>
          <!-- Skeleton rows -->
          <div v-for="i in 6" :key="i" class="flex items-center space-x-6 p-5" :style="{ borderBottom: i < 6 ? '1px solid var(--border-subtle)' : 'none' }">
            <div class="shimmer" style="width: 36px; height: 36px; border-radius: 50%;"></div>
            <div class="shimmer" style="width: 120px; height: 14px;"></div>
            <div class="shimmer ml-auto" style="width: 80px; height: 14px;"></div>
            <div class="shimmer" style="width: 60px; height: 14px;"></div>
            <div class="shimmer" style="width: 70px; height: 28px; border-radius: 8px;"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="animate-fade-in-up">
        <div class="glass-card p-8 text-center">
          <div class="mx-auto mb-4" style="width: 56px; height: 56px; border-radius: 50%; background: rgba(239,68,68,0.1); display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" style="color: #f87171;" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>
          </div>
          <p class="text-lg font-semibold mb-2" style="color: #fca5a5;">Connection Error</p>
          <p class="text-sm mb-6" style="color: var(--text-muted);">{{ errorMessage }}</p>
          <button @click="getCoins" class="btn-outline px-6 py-2.5 text-sm">
            Try Again
          </button>
        </div>
      </div>

      <!-- Coin Table -->
      <div v-else class="animate-fade-in-up animate-delay-2">
        <CoinTable :coins="filteredCoins" @buy="buyCoin" />
      </div>

    </div>
  </div>

</template>

<style scoped>
.stat-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>

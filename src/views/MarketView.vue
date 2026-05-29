<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useMarketStore } from "@/stores/marketStore";
import { usePortfolioStore } from "@/stores/portfolioStore";
import type { Coin } from "@/types/marketTypes";
import CoinTable from "@/components/market/CoinTable.vue";
import { Coins, TrendingUp, Search, AlertTriangle } from 'lucide-vue-next';

const marketStore = useMarketStore();
const portfolioStore = usePortfolioStore();

const { coins, isLoading } = storeToRefs(marketStore);

const errorMessage = ref("");
const searchQuery = ref("");

const getCoins = async () => {
  errorMessage.value = "";

  await marketStore.fetchInitialCoins();

  if (!coins.value || coins.value.length === 0) {
    errorMessage.value = "Could not connect to the market server or no data available. Please try again later.";
  }
};

const filteredCoins = computed(() => {
  if (!coins.value) return [];
  if (!searchQuery.value.trim()) return coins.value;
  const query = searchQuery.value.toLowerCase();
  return coins.value.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.symbol.toLowerCase().includes(query)
  );
});

const totalCoins = computed(() => coins.value?.length ?? 0);

const topGainer = computed(() => {
  if (!coins.value || coins.value.length === 0) return null;
  return coins.value.reduce((a, b) => a.currentPrice > b.currentPrice ? a : b);
});

const buyCoin = async (coin: Coin) => {
  const amountStr = prompt(`Enter amount of ${coin.symbol} to buy:`);
  if (!amountStr) return;
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  await portfolioStore.buyCoin(coin.symbol, amount);
};

onMounted(async () => {
  await getCoins();
  await marketStore.initSignalR();
});
</script>

<template>
  <div class="min-h-screen text-white p-6 md:p-8 bg-matte-black">
    <div class="max-w-7xl mx-auto">

      <!-- Page Header -->
      <div class="mb-8 animate-fade-in-up border-b border-border-subtle pb-6">
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 uppercase text-white font-sans">
          Market <span class="text-volt-green">Overview</span>
        </h1>
        <p class="text-sm font-mono text-text-secondary uppercase tracking-widest">
          > Global Market Index & Asset Tracking
        </p>
      </div>

      <!-- Stats Row + Search -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border-subtle bg-bg-surface mb-8 animate-fade-in-up animate-delay-1" v-if="!isLoading && !errorMessage">

        <!-- Total Coins -->
        <div class="p-5 flex items-center space-x-4 border-b md:border-b-0 md:border-r border-border-subtle hover:bg-bg-hover transition-colors">
          <div class="stat-icon-box bg-bg-deep border border-border-subtle">
            <Coins :size="20" class="text-text-primary" />
          </div>
          <div>
            <p class="label-tech">Indexed Assets</p>
            <p class="text-2xl font-bold font-mono text-white">{{ totalCoins }}</p>
          </div>
        </div>

        <!-- Top Coin -->
        <div class="p-5 flex items-center space-x-4 border-b md:border-b-0 md:border-r border-border-subtle hover:bg-bg-hover transition-colors" v-if="topGainer">
          <div class="stat-icon-box bg-bg-deep border border-volt-green">
            <TrendingUp :size="20" class="text-volt-green" />
          </div>
          <div>
            <p class="label-tech text-volt-green">Top Valuation</p>
            <p class="text-2xl font-bold font-mono text-volt-green">{{ topGainer.symbol }}</p>
          </div>
        </div>

        <!-- Search -->
        <div class="p-5 flex items-center bg-bg-deep">
          <div class="relative w-full">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
                v-model="searchQuery"
                type="text"
                id="market-search"
                placeholder="Search ticker..."
                class="input-mono w-full pl-10"
            >
          </div>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="animate-fade-in-up">
        <div class="mono-card-static overflow-hidden">
          <div class="p-5 flex items-center space-x-4 border-b border-border-subtle bg-bg-deep">
            <div class="shimmer w-24 h-4"></div>
          </div>
          <div v-for="i in 6" :key="i" class="flex items-center space-x-6 p-5 border-b border-border-subtle last:border-0">
            <div class="shimmer w-8 h-8 rounded-sm"></div>
            <div class="shimmer w-24 h-4"></div>
            <div class="shimmer ml-auto w-16 h-4"></div>
            <div class="shimmer w-16 h-4"></div>
            <div class="shimmer w-20 h-8 rounded-sm"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="animate-fade-in-up">
        <div class="mono-card p-8 text-center border-red-500/50">
          <div class="mx-auto mb-4 w-12 h-12 flex items-center justify-center border border-red-500 bg-red-500/10 text-red-500 rounded-sm">
            <AlertTriangle :size="24" />
          </div>
          <p class="text-lg font-bold mb-2 uppercase text-red-400">System Error</p>
          <p class="text-sm font-mono mb-6 text-text-muted">{{ errorMessage }}</p>
          <button @click="getCoins" class="btn-outline px-6 py-2.5 text-sm">
            Retry Connection
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
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>

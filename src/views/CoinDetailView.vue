<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMarketStore } from '@/stores/marketStore';
import type { Coin, PriceHistory } from '@/types/marketTypes';
import VueApexCharts from 'vue3-apexcharts';
import {useMarketNewsStore} from "@/stores/marketNewsStore";
import NewsList from "@/components/market/NewsList.vue";

const route = useRoute();
const marketStore = useMarketStore();
const marketNewsStore = useMarketNewsStore();

const isLoading = ref(true);
const coinData = ref<Coin | null>(null);
const timeframes = [
  { label: '1H', value: '1h' },
  { label: '24H', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '1M', value: '30d' }
];

const selectedTimeframe = ref(timeframes[1].value);

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(value);
};

const chartSeries = computed(() => {
  const history = marketStore.priceHistories || [];

  const formattedData = history.map((item: PriceHistory) => ({
    x: new Date(item.timestamp),
    y: [item.openPrice, item.highPrice, item.lowPrice, item.closePrice]
  }));

  return [{
    name: 'Price',
    data: formattedData
  }];
});

const chartOptions = computed(() => ({
  chart: {
    type: 'candlestick' as const,
    background: 'transparent',
    toolbar: {
      show: false
    },
    animations: {
      enabled: true
    }
  },
  theme: {
    mode: 'dark' as const
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: '#10B981',
        downward: '#EF4444'
      }
    }
  },
  xaxis: {
    type: 'datetime' as const,
    labels: {
      style: {
        colors: '#9CA3AF',
        fontFamily: 'monospace'
      }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    tooltip: {
      enabled: true
    },
    labels: {
      formatter: (val: number) => `$${val.toFixed(2)}`,
      style: {
        colors: '#9CA3AF',
        fontFamily: 'monospace'
      }
    }
  },
  grid: {
    borderColor: 'rgba(255,255,255,0.1)',
    strokeDashArray: 4
  },
  tooltip: {
    theme: 'dark' as const
  }
}));

onMounted(async () => {
  isLoading.value = true;
  try {
    const symbol = String(route.params.symbol);

    if (marketStore.coins.length === 0) {
      await marketStore.fetchInitialCoins();
    }

    await marketStore.fetchPriceHistory(symbol, selectedTimeframe.value);

    const foundCoin = marketStore.coins?.find((c: Coin) => c.symbol === symbol);
    if (foundCoin) {
      coinData.value = foundCoin;
    }

    await marketNewsStore.fetchNewsBySymbol(symbol);

  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    isLoading.value = false;
  }
});

watch(selectedTimeframe, async (newTimeframe) => {
  try {
    const symbol = String(route.params.symbol);
    await marketStore.fetchPriceHistory(symbol, newTimeframe);
  } catch (error) {
    console.error('Fetch history error:', error);
  }
});
</script>

<template>
  <div class="min-h-screen p-6" style="background-color: var(--bg-deep);">
    <div v-if="isLoading" class="flex justify-center items-center h-full">
      <p style="color: var(--text-secondary);">Loading data...</p>
    </div>

    <div v-else class="max-w-6xl mx-auto space-y-6 animate-fade-in-up">

      <div class="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="coin-avatar w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
               style="background-color: var(--accent-1); color: var(--text-primary);">
            {{ coinData?.symbol.charAt(0) }}
          </div>
          <div>
            <h1 class="text-3xl font-bold" style="color: var(--text-primary);">{{ coinData?.name }}</h1>
            <span class="text-sm font-semibold tracking-wider" style="color: var(--text-secondary);">
              {{ coinData?.symbol }}
            </span>
          </div>
        </div>

        <div class="md:text-right">
          <div class="text-4xl font-mono font-bold" style="color: var(--text-primary);">
            {{ formatCurrency(coinData?.currentPrice) }}
          </div>
          <div class="stat-badge positive mt-2 inline-flex items-center gap-1 font-mono text-sm px-2 py-1 rounded">
            <span>▲</span> <span>%2.45</span>
          </div>
        </div>
      </div>

      <div class="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div class="text-sm mb-1" style="color: var(--text-secondary);">Market Cap</div>
          <div class="text-xl font-mono font-bold" style="color: var(--text-primary);">
            {{ formatCurrency(coinData?.marketCap) }}
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
              v-for="tf in timeframes"
              :key="tf.value"
              @click="selectedTimeframe = tf.value"
              :class="[
              'px-4 py-2 rounded font-mono text-sm transition-colors duration-200',
              selectedTimeframe === tf.value ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-700'
            ]"
              :style="{
              backgroundColor: selectedTimeframe === tf.value ? 'var(--accent-1)' : 'transparent',
              color: selectedTimeframe === tf.value ? '#fff' : 'var(--text-secondary)'
            }"
          >
            {{ tf.label }}
          </button>
        </div>
      </div>

      <div class="glass-card p-6">
          <VueApexCharts
              type="candlestick"
              height="600"
              :options="chartOptions"
              :series="chartSeries">
          </VueApexCharts>
      </div>

      <div class="pt-8">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 2v4a2 2 0 002 2h4" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10M7 16h10" />
          </svg>
          Latest {{ coinData?.name }} News
        </h2>
        <NewsList :market-news="marketNewsStore.news" />
        
        <div v-if="marketNewsStore.news.length === 0" class="glass-card p-8 text-center">
          <p class="text-gray-400">No recent news for {{ coinData?.symbol }}.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}
</style>
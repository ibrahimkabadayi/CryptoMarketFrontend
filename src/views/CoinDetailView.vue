<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMarketStore } from '@/stores/marketStore';
import type { Coin, PriceHistory } from '@/types/marketTypes';
import VueApexCharts from 'vue3-apexcharts';
import {useMarketNewsStore} from "@/stores/marketNewsStore";
import NewsList from "@/components/market/NewsList.vue";
import { Newspaper } from 'lucide-vue-next';

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
      enabled: false // Brutalist feel: no animations
    }
  },
  theme: {
    mode: 'dark' as const
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: '#DFFF00',   // Volt green
        downward: '#637381'  // Grey
      },
      wick: {
        useFillColor: true
      }
    }
  },
  xaxis: {
    type: 'datetime' as const,
    labels: {
      style: {
        colors: '#71717a',
        fontFamily: "'JetBrains Mono', monospace"
      }
    },
    axisBorder: { show: true, color: '#232E40' },
    axisTicks: { show: true, color: '#232E40' }
  },
  yaxis: {
    tooltip: {
      enabled: true
    },
    labels: {
      formatter: (val: number) => `$${val.toFixed(2)}`,
      style: {
        colors: '#71717a',
        fontFamily: "'JetBrains Mono', monospace"
      }
    }
  },
  grid: {
    borderColor: '#232E40',
    strokeDashArray: 4
  },
  tooltip: {
    theme: 'dark' as const,
    style: {
      fontFamily: "'JetBrains Mono', monospace"
    }
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
  <div class="min-h-screen p-6 md:p-8 bg-matte-black text-white">
    <div v-if="isLoading" class="flex justify-center items-center h-[60vh]">
      <div class="inline-flex items-center space-x-2 px-4 py-2 border border-volt-green bg-bg-deep uppercase tracking-widest text-xs font-bold text-volt-green rounded-sm">
        <span class="pulse-dot"></span>
        <span>Loading Market Data...</span>
      </div>
    </div>

    <div v-else class="max-w-6xl mx-auto space-y-6 animate-fade-in-up">

      <!-- Header Card -->
      <div class="mono-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-volt-green">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 border border-volt-green flex items-center justify-center text-xl font-bold bg-bg-deep text-volt-green font-mono">
            {{ coinData?.symbol.charAt(0) }}
          </div>
          <div>
            <h1 class="text-3xl font-extrabold uppercase">{{ coinData?.name }}</h1>
            <span class="text-sm font-bold tracking-widest font-mono text-text-muted">
              {{ coinData?.symbol }}
            </span>
          </div>
        </div>

        <div class="md:text-right">
          <div class="text-4xl font-mono font-bold text-white">
            {{ formatCurrency(coinData?.currentPrice) }}
          </div>
          <div class="stat-badge positive mt-2 inline-flex items-center gap-1">
            <span>▲</span> <span>2.45%</span>
          </div>
        </div>
      </div>

      <!-- Stats & Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="mono-card p-6 flex flex-col justify-center">
          <div class="label-tech mb-1 text-text-secondary">Market Capitalization</div>
          <div class="text-xl font-mono font-bold text-white">
            {{ formatCurrency(coinData?.marketCap) }}
          </div>
        </div>

        <div class="mono-card p-6 flex items-center justify-start md:justify-end gap-2 bg-bg-deep">
          <button
              v-for="tf in timeframes"
              :key="tf.value"
              @click="selectedTimeframe = tf.value"
              class="px-4 py-2 font-mono text-xs font-bold transition-colors uppercase tracking-widest border border-border-subtle"
              :class="selectedTimeframe === tf.value ? 'bg-volt-green text-black border-volt-green' : 'bg-transparent text-text-secondary hover:text-white hover:border-text-secondary'"
          >
            {{ tf.label }}
          </button>
        </div>
      </div>

      <!-- Chart -->
      <div class="mono-card p-6 bg-bg-deep overflow-hidden">
          <VueApexCharts
              type="candlestick"
              height="600"
              :options="chartOptions"
              :series="chartSeries">
          </VueApexCharts>
      </div>

      <!-- News Section -->
      <div class="pt-8">
        <h2 class="text-2xl font-extrabold mb-6 flex items-center gap-3 uppercase tracking-wider border-b border-border-subtle pb-4">
          <Newspaper :size="24" class="text-volt-green" />
          Intel: {{ coinData?.symbol }}
        </h2>
        <NewsList :market-news="marketNewsStore.news" />
        
        <div v-if="marketNewsStore.news.length === 0" class="mono-card p-8 text-center bg-bg-surface">
          <p class="font-mono text-text-muted">No intelligence reports acquired for {{ coinData?.symbol }}.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.pulse-dot {
  width: 6px;
  height: 6px;
  background-color: var(--volt-green);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
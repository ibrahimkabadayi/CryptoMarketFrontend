<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMarketStore } from '@/stores/marketStore';
import type { Coin, PriceHistory } from '@/types/marketTypes';
import VueApexCharts from 'vue3-apexcharts';
import {useMarketNewsStore} from "@/stores/marketNewsStore";
import NewsList from "@/components/market/NewsList.vue";
import { Newspaper, TrendingUp, TrendingDown } from 'lucide-vue-next';
import { marketApi } from '@/api/marketApi';

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

// Limit Order Logic
const orderType = ref<'Buy' | 'Sell'>('Buy');
const targetPrice = ref<number | ''>('');
const orderAmount = ref<number | ''>('');
const orderSubmitting = ref(false);
const orderSuccess = ref(false);
const orderError = ref('');

const submitLimitOrder = async () => {
  if (!targetPrice.value || !orderAmount.value) {
    orderError.value = 'Target price and amount are required';
    return;
  }

  orderSubmitting.value = true;
  orderSuccess.value = false;
  orderError.value = '';

  try {
    await marketApi.setLimitOrder({
      symbol: String(route.params.symbol),
      targetPrice: Number(targetPrice.value),
      amount: Number(orderAmount.value),
      orderType: orderType.value
    });

    orderSuccess.value = true;
    targetPrice.value = '';
    orderAmount.value = '';

    setTimeout(() => {
      orderSuccess.value = false;
    }, 3000);
  } catch (error: any) {
    orderError.value = error?.response?.data?.message || 'Failed to place order';
  } finally {
    orderSubmitting.value = false;
  }
};
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

      <!-- Limit Order Section -->
      <div class="mono-card p-6 bg-bg-surface border-l-4 border-volt-green">
        <h2 class="text-xl font-extrabold mb-6 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp :size="20" class="text-volt-green" />
          Set Limit Order
        </h2>

        <!-- Order Type Toggle -->
        <div class="flex gap-3 mb-6">
          <button
            @click="orderType = 'Buy'"
            class="flex-1 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest border-2 transition-all"
            :class="orderType === 'Buy'
              ? 'bg-volt-green text-black border-volt-green'
              : 'bg-transparent text-text-secondary border-border-subtle hover:border-volt-green hover:text-white'"
          >
            <TrendingUp :size="16" class="inline mr-2" />
            Buy
          </button>
          <button
            @click="orderType = 'Sell'"
            class="flex-1 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest border-2 transition-all"
            :class="orderType === 'Sell'
              ? 'bg-red-500 text-black border-red-500'
              : 'bg-transparent text-text-secondary border-border-subtle hover:border-red-500 hover:text-white'"
          >
            <TrendingDown :size="16" class="inline mr-2" />
            Sell
          </button>
        </div>

        <!-- Order Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="label-tech mb-2 block text-text-secondary">Target Price (USD)</label>
            <input
              v-model="targetPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="w-full px-4 py-3 bg-bg-deep border border-border-subtle text-white font-mono focus:outline-none focus:border-volt-green transition-colors"
            />
          </div>

          <div>
            <label class="label-tech mb-2 block text-text-secondary">Amount ({{ coinData?.symbol }})</label>
            <input
              v-model="orderAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="w-full px-4 py-3 bg-bg-deep border border-border-subtle text-white font-mono focus:outline-none focus:border-volt-green transition-colors"
            />
          </div>
        </div>

        <!-- Order Summary -->
        <div v-if="targetPrice && orderAmount" class="mb-6 p-4 bg-bg-deep border border-border-subtle">
          <div class="label-tech mb-2 text-text-secondary">Order Summary</div>
          <div class="flex justify-between items-center font-mono text-sm">
            <span class="text-text-muted">Total Value:</span>
            <span class="text-white font-bold">{{ formatCurrency(Number(targetPrice) * Number(orderAmount)) }}</span>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          @click="submitLimitOrder"
          :disabled="orderSubmitting || !targetPrice || !orderAmount"
          class="w-full px-6 py-4 font-mono text-sm font-bold uppercase tracking-widest border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :class="orderType === 'Buy'
            ? 'bg-volt-green text-black border-volt-green hover:bg-transparent hover:text-volt-green'
            : 'bg-red-500 text-black border-red-500 hover:bg-transparent hover:text-red-500'"
        >
          <span v-if="orderSubmitting">Processing...</span>
          <span v-else>Place {{ orderType }} Order</span>
        </button>

        <!-- Success Message -->
        <div v-if="orderSuccess" class="mt-4 p-4 bg-volt-green/10 border border-volt-green text-volt-green font-mono text-sm">
          ✓ Limit order placed successfully
        </div>

        <!-- Error Message -->
        <div v-if="orderError" class="mt-4 p-4 bg-red-500/10 border border-red-500 text-red-500 font-mono text-sm">
          ✗ {{ orderError }}
        </div>
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
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMarketStore } from '@/stores/marketStore';
import { useLimitOrderStore } from '@/stores/limitOrderStore';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { usePriceAlertStore } from '@/stores/priceAlertStore';
import type { Coin, PriceHistory } from '@/types/marketTypes';
import type { LimitOrderDto } from '@/types/limitOrderTypes';
import VueApexCharts from 'vue3-apexcharts';
import {useMarketNewsStore} from "@/stores/marketNewsStore";
import NewsList from "@/components/market/NewsList.vue";
import { Newspaper, TrendingUp, TrendingDown, Pencil, Trash2, Check, X, Bell } from 'lucide-vue-next';

const route = useRoute();
const marketStore = useMarketStore();
const marketNewsStore = useMarketNewsStore();
const limitOrderStore = useLimitOrderStore();
const portfolioStore = usePortfolioStore();
const priceAlertStore = usePriceAlertStore();

const isLoading = ref(true);
const isLoggedIn = computed(() => !!localStorage.getItem('token'));
const coinData = computed(() => {
  const symbol = String(route.params.symbol);
  return marketStore.coins?.find((c: Coin) => c.symbol === symbol) || null;
});
const timeframes = [
  { label: '1H', value: '1h' },
  { label: '24H', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '1M', value: '30d' }
];

const selectedTimeframe = ref(timeframes[2].value);

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
  const history = [...(marketStore.priceHistories || [])].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const formattedData = history.map((item: PriceHistory) => ({
    x: new Date(item.timestamp).getTime(),
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
      enabled: false
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
  stroke: {
    width: 2,
    colors: ['#a1a1aa']
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

    await Promise.all([
      marketNewsStore.fetchNewsBySymbol(symbol),
      portfolioStore.fetchDashboard(),
      limitOrderStore.fetchAllOrders()
    ]);

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

const orderType = ref<'Buy' | 'Sell'>('Buy');
const targetPrice = ref<number | ''>('');
const orderAmount = ref<number | ''>('');
const orderSubmitting = ref(false);

// Price Alert State
const alertDirection = ref<'above' | 'below'>('above');
const alertPrice = ref<number | ''>('');
const alertSubmitting = ref(false);

const currentSymbolOrders = computed(() => {
  const symbol = String(route.params.symbol);
  return limitOrderStore.sortedOrders.filter(
    o => o.symbol?.toUpperCase() === symbol.toUpperCase()
  );
});

const editingOrderId = ref<string | null>(null);
const editTargetPrice = ref<number>(0);
const editAmount = ref<number>(0);

const startEdit = (order: LimitOrderDto) => {
  editingOrderId.value = order.id;
  editTargetPrice.value = order.targetPrice;
  editAmount.value = order.amount;
};

const cancelEdit = () => {
  editingOrderId.value = null;
};

const saveEdit = async (orderId: string) => {
  const success = await limitOrderStore.updateOrder(orderId, editAmount.value, editTargetPrice.value);
  if (success) {
    editingOrderId.value = null;
  }
};

const deleteOrder = async (orderId: string) => {
  await limitOrderStore.deleteOrder(orderId);
};

const submitLimitOrder = async () => {
  if (!targetPrice.value || !orderAmount.value) {
    limitOrderStore.errorMessage = 'Target price and amount are required';
    return;
  }

  const walletId = portfolioStore.dashboard?.walletId;
  if (!walletId) {
    limitOrderStore.errorMessage = 'Wallet not found. Please visit your portfolio first.';
    return;
  }

  orderSubmitting.value = true;
  limitOrderStore.clearMessages();

  try {
    const success = await limitOrderStore.createOrder(
      walletId,
      String(route.params.symbol),
      Number(targetPrice.value),
      Number(orderAmount.value),
      orderType.value
    );

    if (success) {
      targetPrice.value = '';
      orderAmount.value = '';
    }
  } finally {
    orderSubmitting.value = false;
  }
};

const formatTimeAgo = (dateString?: string): string => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const submitPriceAlert = async () => {
  if (!alertPrice.value) {
    priceAlertStore.errorMessage = 'Target price is required';
    return;
  }

  alertSubmitting.value = true;
  priceAlertStore.errorMessage = '';

  try {
    const success = await priceAlertStore.createAlert(
      String(route.params.symbol),
      Number(alertPrice.value),
      alertDirection.value === 'above'
    );

    if (success) {
      alertPrice.value = '';
      alertDirection.value = 'above';
    }
  } finally {
    alertSubmitting.value = false;
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

    <div v-else class="max-w-6xl mx-auto space-y-6">

      <!-- Header Card -->
      <div 
        class="mono-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-volt-green transition-colors duration-500 relative overflow-hidden"
      >
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
          <div class="text-4xl font-mono font-bold transition-colors duration-500" :class="{
            'text-volt-green price-up-flash': coinData?.priceChangeStatus === 'up',
            'text-red-500 price-down-flash': coinData?.priceChangeStatus === 'down',
            'text-white': !coinData?.priceChangeStatus || coinData?.priceChangeStatus === 'none'
          }">
            {{ formatCurrency(coinData?.currentPrice) }}
          </div>
          <div class="stat-badge mt-2 inline-flex items-center gap-1" :class="coinData?.percentChange >= 0 ? 'positive' : 'negative'">
            <TrendingUp v-if="coinData?.percentChange >= 0" :size="14" />
            <TrendingDown v-else :size="14" />
            <span>{{ coinData?.percentChange >= 0 ? '+' : '' }}{{ coinData?.percentChange?.toFixed(2) }}%</span>
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
        <div v-if="limitOrderStore.successMessage" class="mt-4 p-4 bg-volt-green/10 border border-volt-green text-volt-green font-mono text-sm">
          ✓ {{ limitOrderStore.successMessage }}
        </div>

        <!-- Error Message -->
        <div v-if="limitOrderStore.errorMessage" class="mt-4 p-4 bg-red-500/10 border border-red-500 text-red-500 font-mono text-sm">
          ✗ {{ limitOrderStore.errorMessage }}
        </div>
      </div>

      <!-- Price Alert Section -->
      <div v-if="isLoggedIn" class="mono-card p-6 bg-bg-surface border-l-4 border-volt-green">
        <h2 class="text-xl font-extrabold mb-6 uppercase tracking-wider flex items-center gap-2">
          <Bell :size="20" class="text-volt-green" />
          Set Price Alert
        </h2>

        <!-- Alert Direction Toggle -->
        <div class="flex gap-3 mb-6">
          <button
            @click="alertDirection = 'above'"
            class="flex-1 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest border-2 transition-all"
            :class="alertDirection === 'above'
              ? 'bg-volt-green text-black border-volt-green'
              : 'bg-transparent text-text-secondary border-border-subtle hover:border-volt-green hover:text-white'"
          >
            <TrendingUp :size="16" class="inline mr-2" />
            Alert Above
          </button>
          <button
            @click="alertDirection = 'below'"
            class="flex-1 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest border-2 transition-all"
            :class="alertDirection === 'below'
              ? 'bg-red-500 text-black border-red-500'
              : 'bg-transparent text-text-secondary border-border-subtle hover:border-red-500 hover:text-white'"
          >
            <TrendingDown :size="16" class="inline mr-2" />
            Alert Below
          </button>
        </div>

        <!-- Alert Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="label-tech mb-2 block text-text-secondary">Target Price (USD)</label>
            <input
              v-model="alertPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="w-full px-4 py-3 bg-bg-deep border border-border-subtle text-white font-mono focus:outline-none focus:border-volt-green transition-colors"
            />
          </div>

          <div class="flex flex-col justify-end">
            <p class="text-text-muted text-xs mb-2">Notify me when {{ coinData?.symbol }} is {{ alertDirection === 'above' ? 'above' : 'below' }} target</p>
          </div>
        </div>

        <!-- Alert Summary -->
        <div v-if="alertPrice" class="mb-6 p-4 bg-bg-deep border border-border-subtle">
          <div class="label-tech mb-2 text-text-secondary">Alert Summary</div>
          <div class="flex justify-between items-center font-mono text-sm">
            <span class="text-text-muted">{{ coinData?.symbol }} {{ alertDirection === 'above' ? '▲ Above' : '▼ Below' }}</span>
            <span class="text-white font-bold">{{ formatCurrency(Number(alertPrice)) }}</span>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          @click="submitPriceAlert"
          :disabled="alertSubmitting || !alertPrice"
          class="w-full px-6 py-4 font-mono text-sm font-bold uppercase tracking-widest border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :class="alertDirection === 'above'
            ? 'bg-volt-green text-black border-volt-green hover:bg-transparent hover:text-volt-green'
            : 'bg-red-500 text-black border-red-500 hover:bg-transparent hover:text-red-500'"
        >
          <span v-if="alertSubmitting">Processing...</span>
          <span v-else>Set {{ alertDirection === 'above' ? 'Above' : 'Below' }} Alert</span>
        </button>

        <!-- Success Message -->
        <div v-if="priceAlertStore.successMessage" class="mt-4 p-4 bg-volt-green/10 border border-volt-green text-volt-green font-mono text-sm">
          ✓ {{ priceAlertStore.successMessage }}
        </div>

        <!-- Error Message -->
        <div v-if="priceAlertStore.errorMessage" class="mt-4 p-4 bg-red-500/10 border border-red-500 text-red-500 font-mono text-sm">
          ✗ {{ priceAlertStore.errorMessage }}
        </div>
      </div>

      <!-- Existing Orders for this coin -->
      <div v-if="currentSymbolOrders.length > 0" class="mono-card bg-bg-surface overflow-hidden">
        <div class="p-6 border-b border-border-subtle">
          <h2 class="text-xl font-extrabold uppercase tracking-wider flex items-center gap-2">
            <TrendingUp :size="20" class="text-volt-green" />
            Active Orders — {{ coinData?.symbol }}
          </h2>
        </div>

        <table class="table-premium">
          <thead>
            <tr>
              <th>Type</th>
              <th>Target Price</th>
              <th>Amount</th>
              <th>Total Value</th>
              <th>Created</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in currentSymbolOrders"
              :key="order.id"
              class="order-row"
            >
              <!-- Type -->
              <td>
                <span
                  class="order-type-badge"
                  :class="order.orderType === 1 ? 'order-type-buy' : 'order-type-sell'"
                >
                  <TrendingUp v-if="order.orderType === 1" :size="12" :stroke-width="2.5" class="inline" />
                  <TrendingDown v-else :size="12" :stroke-width="2.5" class="inline" />
                  {{ order.orderType === 1 ? 'Buy' : 'Sell' }}
                </span>
              </td>

              <!-- Target Price -->
              <td>
                <template v-if="editingOrderId === order.id">
                  <input
                    v-model="editTargetPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    class="order-edit-input"
                  />
                </template>
                <span v-else class="font-mono text-sm font-bold text-white">
                  {{ formatCurrency(order.targetPrice) }}
                </span>
              </td>

              <!-- Amount -->
              <td>
                <template v-if="editingOrderId === order.id">
                  <input
                    v-model="editAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    class="order-edit-input"
                  />
                </template>
                <span v-else class="font-mono text-sm text-text-secondary">
                  {{ order.amount }}
                </span>
              </td>

              <!-- Total Value -->
              <td>
                <span class="font-mono text-sm text-text-secondary">
                  {{ editingOrderId === order.id
                    ? formatCurrency(editTargetPrice * editAmount)
                    : formatCurrency(order.targetPrice * order.amount)
                  }}
                </span>
              </td>

              <!-- Created -->
              <td>
                <span class="font-mono text-xs text-text-muted">
                  {{ formatTimeAgo(order.createdAt) }}
                </span>
              </td>

              <!-- Actions -->
              <td class="text-right">
                <div class="flex items-center justify-end gap-2">
                  <template v-if="editingOrderId === order.id">
                    <button
                      class="order-action-btn order-save-btn"
                      @click="saveEdit(order.id)"
                      title="Save changes"
                    >
                      <Check :size="14" :stroke-width="2.5" />
                    </button>
                    <button
                      class="order-action-btn order-cancel-btn"
                      @click="cancelEdit"
                      title="Cancel"
                    >
                      <X :size="14" :stroke-width="2.5" />
                    </button>
                  </template>
                  <template v-else>
                    <button
                      class="order-action-btn order-edit-btn"
                      @click="startEdit(order)"
                      title="Edit order"
                    >
                      <Pencil :size="14" :stroke-width="2" />
                    </button>
                    <button
                      class="order-action-btn order-delete-btn"
                      @click="deleteOrder(order.id)"
                      title="Delete order"
                    >
                      <Trash2 :size="14" :stroke-width="2" />
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

/* Order table styles */
.order-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 2px;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid transparent;
}

.order-type-buy {
  color: var(--accent-1);
  border-color: var(--accent-1);
  background: rgba(223, 255, 0, 0.06);
}

.order-type-sell {
  color: #f87171;
  border-color: #f87171;
  background: rgba(248, 113, 113, 0.06);
}

.order-edit-input {
  width: 100px;
  padding: 4px 8px;
  background: var(--bg-deep);
  border: 1px solid var(--accent-1);
  border-radius: 2px;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  outline: none;
}

.order-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 2px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.order-edit-btn:hover {
  border-color: var(--accent-1);
  color: var(--accent-1);
  background: rgba(223, 255, 0, 0.06);
}

.order-delete-btn:hover {
  border-color: #f87171;
  color: #f87171;
  background: rgba(248, 113, 113, 0.06);
}

.order-save-btn:hover {
  border-color: #34d399;
  color: #34d399;
  background: rgba(52, 211, 153, 0.06);
}

.order-cancel-btn:hover {
  border-color: var(--text-secondary);
  color: var(--text-secondary);
}
</style>
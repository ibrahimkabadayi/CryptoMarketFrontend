<script setup lang="ts">
import type {Coin} from "@/types/marketTypes";
import { Plus, TrendingUp, TrendingDown, LayoutGrid } from 'lucide-vue-next';

const props = defineProps<{
  coins: Coin[]
}>();

const emit = defineEmits<{
  (e: 'buy', coin: Coin): void
}>();

const getSymbolColor = (symbol: string) => {
  const colors = [
    { bg: 'var(--bg-deep)', text: '#ffffff', border: '#3A4A69' },
    { bg: 'var(--bg-deep)', text: '#DFFF00', border: '#DFFF00' },
  ];
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Resolve icon URL: prefer explicit IconUrlPng/iconUrlPng, fall back to spothq repo by symbol
const getIconUrl = (coin: Coin) => {
  if (!coin) return '';
  return coin.iconUrlPng ?? coin.IconUrlPng ?? `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${coin.symbol.toLowerCase()}.png`;
};

</script>

<template>
  <div class="mono-card overflow-hidden">

    <div class="flex items-center justify-between p-5 border-b border-border-subtle bg-bg-deep">
      <h2 class="text-lg font-bold uppercase tracking-wider text-white">Asset Directory</h2>
      <span class="text-xs font-bold px-3 py-1 border border-volt-green text-volt-green bg-bg-deep rounded-sm">
        {{ coins?.length || 0 }} LISTED
      </span>
    </div>

    <div class="overflow-x-auto">
      <table class="table-premium w-full text-left border-collapse">

        <thead>
        <tr>
          <th style="width: 50px;">ID</th>
          <th>Asset Name</th>
          <th>Ticker</th>
          <th class="text-right">Price (USD)</th>
          <th class="text-right">24h Volatility</th>
          <th class="text-right">Capitalization</th>
          <th class="text-center" style="width: 120px;">Action</th>
        </tr>
        </thead>

        <tbody>
        <tr
            v-for="(coin, index) in coins"
            :key="coin.symbol"
            class="coin-row group transition-colors"
        >
          <td class="font-mono text-text-muted text-sm border-r border-border-subtle">
            <img v-if="getIconUrl(coin)" :src="getIconUrl(coin)" class="w-6 h-6 mx-auto" :alt="coin.symbol" />
            <span v-else>{{ String(index + 1).padStart(3, '0') }}</span>
          </td>

          <td>
            <div class="flex items-center space-x-3">
              <div
                  class="coin-avatar flex items-center justify-center font-mono font-bold text-sm overflow-hidden"
                  :style="{
                    background: getSymbolColor(coin.symbol).bg,
                    borderColor: getSymbolColor(coin.symbol).border,
                    color: getSymbolColor(coin.symbol).text
                  }"
              >
                <img v-if="getIconUrl(coin)" :src="getIconUrl(coin)" class="w-full h-full object-cover" :alt="coin.symbol" />
                <span v-else>{{ coin.symbol.charAt(0) }}</span>
              </div>
              <span class="font-bold text-white uppercase">
                <router-link :to="{ name: 'coin-detail', params: { symbol: coin.symbol } }" class="hover:text-volt-green transition-colors">
                    {{ coin.name }}
                </router-link>
              </span>
            </div>
          </td>

          <td class="font-mono font-bold text-text-secondary">{{ coin.symbol }}</td>

          <td class="text-right font-mono font-bold transition-colors duration-500" :class="{
            'text-volt-green price-up-flash': coin.priceChangeStatus === 'up',
            'text-red-500 price-down-flash': coin.priceChangeStatus === 'down',
            'text-white': !coin.priceChangeStatus || coin.priceChangeStatus === 'none'
          }">
            ${{ coin.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00' }}
          </td>

          <td class="text-right">
            <span class="stat-badge" :class="coin.percentChange >= 0 ? 'positive' : 'negative'">
              <TrendingUp v-if="coin.percentChange >= 0" :size="12" class="mr-1" />
              <TrendingDown v-else :size="12" class="mr-1" />
              {{ coin.percentChange >= 0 ? '+' : '' }}{{ coin.percentChange?.toFixed(2) }}%
            </span>
          </td>

          <td class="text-right font-mono text-text-secondary border-r border-border-subtle">
            ${{ coin.marketCap?.toLocaleString() || '0' }}
          </td>

          <td class="text-center">
            <button
                @click="emit('buy', coin)"
                class="btn-outline opacity-0 group-hover:opacity-100 transition-opacity text-xs py-1 px-3 w-full flex items-center justify-center gap-1"
            >
              <Plus :size="14" />
              BUY
            </button>
          </td>

        </tr>
        </tbody>

      </table>
    </div>

    <div v-if="!coins || coins.length === 0" class="p-12 text-center border-t border-border-subtle bg-bg-surface">
      <div class="mx-auto mb-4 w-16 h-16 flex items-center justify-center border border-border-subtle bg-bg-deep text-text-muted">
        <LayoutGrid :size="32" />
      </div>
      <p class="font-bold mb-1 text-white uppercase tracking-wider">No Data Stream</p>
      <p class="text-sm font-mono text-text-muted">Awaiting asset list from node.</p>
    </div>
  </div>
</template>

<style scoped>
.coin-avatar {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.coin-row {
  opacity: 1;
}

.coin-row:hover .coin-avatar {
  transform: scale(1.05);
}

.coin-row:hover {
  background: var(--bg-hover);
}
</style>

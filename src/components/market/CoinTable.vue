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

const getMockChange = (symbol: string) => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  const val = ((Math.abs(hash) % 1500) - 500) / 100;
  return val;
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
            :style="{ animationDelay: `${index * 0.04}s` }"
        >
          <td class="font-mono text-text-muted text-sm border-r border-border-subtle">{{ String(index + 1).padStart(3, '0') }}</td>

          <td>
            <div class="flex items-center space-x-3">
              <div
                  class="coin-avatar flex items-center justify-center font-mono font-bold text-sm"
                  :style="{
                    background: getSymbolColor(coin.symbol).bg,
                    borderColor: getSymbolColor(coin.symbol).border,
                    color: getSymbolColor(coin.symbol).text
                  }"
              >
                {{ coin.symbol.charAt(0) }}
              </div>
              <span class="font-bold text-white uppercase">
                <router-link :to="{ name: 'coin-detail', params: { symbol: coin.symbol } }" class="hover:text-volt-green transition-colors">
                    {{ coin.name }}
                </router-link>
              </span>
            </div>
          </td>

          <td class="font-mono font-bold text-text-secondary">{{ coin.symbol }}</td>

          <td class="text-right font-mono font-bold text-white">
            ${{ coin.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00' }}
          </td>

          <td class="text-right">
            <span class="stat-badge" :class="getMockChange(coin.symbol) >= 0 ? 'positive' : 'negative'">
              <TrendingUp v-if="getMockChange(coin.symbol) >= 0" :size="12" class="mr-1" />
              <TrendingDown v-else :size="12" class="mr-1" />
              {{ getMockChange(coin.symbol) >= 0 ? '+' : '' }}{{ getMockChange(coin.symbol).toFixed(2) }}%
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
  animation: fadeInUp 0.3s ease-out forwards;
  opacity: 0;
}

.coin-row:hover .coin-avatar {
  transform: scale(1.05);
}

.coin-row:hover {
  background: var(--bg-hover);
}
</style>

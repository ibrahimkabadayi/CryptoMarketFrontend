<script setup lang="ts">
import type {Coin} from "@/types/market";

const props = defineProps<{
  coins: Coin[]
}>();

const emit = defineEmits<{
  (e: 'buy', coin: Coin): void
}>();

const getSymbolColor = (symbol: string) => {
  const colors = [
    { bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' },
    { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
    { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
    { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
    { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
    { bg: 'rgba(14, 165, 233, 0.15)', text: '#38bdf8', border: 'rgba(14, 165, 233, 0.3)' },
    { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
    { bg: 'rgba(20, 184, 166, 0.15)', text: '#2dd4bf', border: 'rgba(20, 184, 166, 0.3)' },
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
  <div class="glass-card-static overflow-hidden">

    <div class="flex items-center justify-between p-5" style="border-bottom: 1px solid var(--border-subtle); background: rgba(10, 14, 26, 0.3);">
      <h2 class="text-lg font-semibold" style="color: var(--text-primary);">All Coins</h2>
      <span class="text-xs font-medium px-3 py-1 rounded-full" style="background: rgba(99,102,241,0.1); color: var(--accent-3);">
        {{ coins?.length || 0 }} listed
      </span>
    </div>

    <div class="overflow-x-auto">
      <table class="table-premium">

        <thead>
        <tr>
          <th style="width: 50px;">#</th>
          <th>Name</th>
          <th>Symbol</th>
          <th class="text-right">Price</th>
          <th class="text-right">24h Change</th>
          <th class="text-right">Market Cap</th>
          <th class="text-center" style="width: 100px;">Action</th>
        </tr>
        </thead>

        <tbody>
        <tr
            v-for="(coin, index) in coins"
            :key="coin.symbol"
            class="coin-row"
            :style="{ animationDelay: `${index * 0.04}s` }"
        >
          <td class="font-medium" style="color: var(--text-muted);">{{ index + 1 }}</td>

          <td>
            <div class="flex items-center space-x-3">
              <div
                  class="coin-avatar"
                  :style="{
                    background: getSymbolColor(coin.symbol).bg,
                    borderColor: getSymbolColor(coin.symbol).border,
                    color: getSymbolColor(coin.symbol).text
                  }"
              >
                {{ coin.symbol.charAt(0) }}
              </div>
              <span class="font-semibold" style="color: var(--text-primary);">{{ coin.name }}</span>
            </div>
          </td>

          <td class="font-medium" style="color: var(--text-muted);">{{ coin.symbol }}</td>

          <td class="text-right font-mono font-semibold" style="color: var(--text-primary);">
            ${{ coin.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00' }}
          </td>

          <td class="text-right">
            <span class="stat-badge" :class="getMockChange(coin.symbol) >= 0 ? 'positive' : 'negative'">
              <svg v-if="getMockChange(coin.symbol) >= 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3">
                <path fill-rule="evenodd" d="M8 14a.75.75 0 01-.75-.75V4.56L4.03 7.78a.75.75 0 01-1.06-1.06l4.5-4.5a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06L8.75 4.56v8.69A.75.75 0 018 14z" clip-rule="evenodd"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3">
                <path fill-rule="evenodd" d="M8 2a.75.75 0 01.75.75v8.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 011.06-1.06l3.22 3.22V2.75A.75.75 0 018 2z" clip-rule="evenodd"/>
              </svg>
              {{ getMockChange(coin.symbol) >= 0 ? '+' : '' }}{{ getMockChange(coin.symbol).toFixed(2) }}%
            </span>
          </td>

          <td class="text-right font-mono" style="color: var(--text-secondary);">
            ${{ coin.marketCap?.toLocaleString() || '0' }}
          </td>

          <td class="text-center">
            <button
                @click="emit('buy', coin)"
                class="buy-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
                <path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z"/>
              </svg>
              Buy
            </button>
          </td>

        </tr>
        </tbody>

      </table>
    </div>

    <div v-if="!coins || coins.length === 0" class="p-12 text-center">
      <div class="mx-auto mb-4" style="width: 64px; height: 64px; border-radius: 16px; background: rgba(99,102,241,0.08); display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-8 h-8" style="color: var(--text-muted);">
          <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z"/>
        </svg>
      </div>
      <p class="font-semibold mb-1" style="color: var(--text-secondary);">No coins found</p>
      <p class="text-sm" style="color: var(--text-muted);">Try adjusting your search or check back later.</p>
    </div>
  </div>
</template>

<style scoped>
.coin-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.coin-row {
  animation: fadeInUp 0.4s ease-out forwards;
  opacity: 0;
}

.coin-row:hover .coin-avatar {
  transform: scale(1.1);
}

.coin-row:hover {
  background: rgba(99, 102, 241, 0.04) !important;
}

.buy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(99, 102, 241, 0.12);
  color: var(--accent-3);
  border: 1px solid rgba(99, 102, 241, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
}

.coin-row:hover .buy-btn {
  opacity: 1;
}

.buy-btn:hover {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
</style>

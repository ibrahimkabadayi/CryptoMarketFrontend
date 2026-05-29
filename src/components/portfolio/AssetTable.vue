<script setup lang="ts">
import type { Asset } from "@/types/portfolioTypes";
import { Wallet } from 'lucide-vue-next';

const props = defineProps<{
  assets: Asset[],
  totalInvested?: number
}>();

defineEmits<{
  (e: 'sell', symbol: string): void,
  (e: 'buy', symbol: string): void
}>();

const getSymbolColor = (symbol: string) => {
  const colors = [
    { bg: 'var(--bg-deep)', text: '#ffffff', border: '#3A4A69' },
    { bg: 'var(--bg-deep)', text: '#DFFF00', border: '#DFFF00' },
  ];
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const getSharePercent = (amount: number) => {
  if (!props.totalInvested || props.totalInvested === 0) return 0;
  return Math.min((amount / props.totalInvested) * 100, 100);
};
</script>

<template>
  <div class="mono-card overflow-hidden">
    <div class="flex items-center justify-between p-5 border-b border-border-subtle bg-bg-deep">
      <h2 class="text-lg font-bold uppercase tracking-wider text-white">Asset Inventory</h2>
      <span class="text-xs font-bold px-3 py-1 border border-volt-green text-volt-green bg-bg-deep rounded-sm">
        {{ assets?.length || 0 }} HOLDINGS
      </span>
    </div>

    <div class="overflow-x-auto">
      <table class="table-premium w-full text-left border-collapse">
        <thead>
        <tr>
          <th>Asset</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Avg Buy Price</th>
          <th class="text-right">Invested</th>
          <th style="width:120px">Share</th>
          <th class="text-center" style="width: 140px;">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(asset, index) in assets" :key="asset.symbol" class="asset-row group transition-colors hover:bg-bg-hover" :style="{animationDelay:`${index*0.05}s`}">
          <td>
            <div class="flex items-center space-x-3">
              <div class="asset-badge flex items-center justify-center font-mono font-bold text-sm" :style="{background:getSymbolColor(asset.symbol).bg,borderColor:getSymbolColor(asset.symbol).border,color:getSymbolColor(asset.symbol).text}">
                {{ asset.symbol.charAt(0) }}
              </div>
              <span class="font-bold text-white uppercase">{{ asset.symbol }}</span>
            </div>
          </td>
          <td class="text-right font-mono font-bold text-text-secondary">{{ asset.quantity.toLocaleString() }}</td>
          <td class="text-right font-mono font-bold text-text-muted">${{ asset.averageBuyPrice.toLocaleString() }}</td>
          <td class="text-right font-mono font-bold text-volt-green">${{ asset.investedAmount.toLocaleString() }}</td>
          <td>
            <div class="progress-bar-bg border border-border-subtle bg-bg-deep">
              <div class="progress-bar-fill bg-text-primary" :style="{width: getSharePercent(asset.investedAmount)+'%', background: getSymbolColor(asset.symbol).text}"></div>
            </div>
          </td>
          <td class="text-center">
            <div class="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="$emit('buy', asset.symbol)" class="buy-btn-small">
                BUY
              </button>
              <button @click="$emit('sell', asset.symbol)" class="sell-btn">
                SELL
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="!assets?.length" class="p-12 text-center border-t border-border-subtle bg-bg-surface">
        <div class="mx-auto mb-4 w-16 h-16 flex items-center justify-center border border-border-subtle bg-bg-deep text-text-muted">
          <Wallet :size="32" />
        </div>
        <p class="font-bold mb-1 text-white uppercase tracking-wider">Empty Portfolio</p>
        <p class="text-sm font-mono text-text-muted">Execute trades to populate inventory.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.asset-badge {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid;
  flex-shrink: 0;
  transition: transform .15s ease;
}
.asset-row {
  animation: fadeInUp .3s ease-out forwards;
  opacity: 0;
}
.asset-row:hover .asset-badge {
  transform: scale(1.05);
}
.progress-bar-bg {
  width: 100%;
  height: 8px;
  border-radius: 0;
}
.progress-bar-fill {
  height: 100%;
  border-radius: 0;
  transition: width .3s ease-out;
}
.sell-btn {
  padding: 4px 10px;
  border-radius: 2px;
  font-size: 0.75rem;
  font-weight: 700;
  background: transparent;
  color: #f87171;
  border: 1px solid #f87171;
  cursor: pointer;
  transition: all 0.15s ease;
}
.sell-btn:hover {
  background: #f87171;
  color: #000;
}
.buy-btn-small {
  padding: 4px 10px;
  border-radius: 2px;
  font-size: 0.75rem;
  font-weight: 700;
  background: transparent;
  color: var(--volt-green);
  border: 1px solid var(--volt-green);
  cursor: pointer;
  transition: all 0.15s ease;
}
.buy-btn-small:hover {
  background: var(--volt-green);
  color: #000;
}
</style>

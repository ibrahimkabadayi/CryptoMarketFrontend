<script setup lang="ts">
import type { Asset } from "@/types/portfolio";
import { computed } from "vue";

const props = defineProps<{
  assets: Asset[],
  totalInvested?: number
}>();

const getSymbolColor = (symbol: string) => {
  const colors = [
    { bg: 'rgba(99,102,241,0.15)', text: '#818cf8', border: 'rgba(99,102,241,0.3)' },
    { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.3)' },
    { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
    { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.3)' },
    { bg: 'rgba(236,72,153,0.15)', text: '#f472b6', border: 'rgba(236,72,153,0.3)' },
    { bg: 'rgba(14,165,233,0.15)', text: '#38bdf8', border: 'rgba(14,165,233,0.3)' },
    { bg: 'rgba(168,85,247,0.15)', text: '#c084fc', border: 'rgba(168,85,247,0.3)' },
    { bg: 'rgba(20,184,166,0.15)', text: '#2dd4bf', border: 'rgba(20,184,166,0.3)' },
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
  <div class="glass-card-static overflow-hidden">
    <div class="flex items-center justify-between p-5" style="border-bottom:1px solid var(--border-subtle);background:rgba(10,14,26,0.3)">
      <h2 class="text-lg font-semibold" style="color:var(--text-primary)">Your Assets</h2>
      <span class="text-xs font-medium px-3 py-1 rounded-full" style="background:rgba(16,185,129,0.1);color:#34d399">
        {{ assets?.length || 0 }} holdings
      </span>
    </div>

    <div class="overflow-x-auto">
      <table class="table-premium">
        <thead>
        <tr>
          <th>Asset</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Avg Buy Price</th>
          <th class="text-right">Invested</th>
          <th style="width:120px">Share</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(asset, index) in assets" :key="asset.symbol" class="asset-row" :style="{animationDelay:`${index*0.05}s`}">
          <td>
            <div class="flex items-center space-x-3">
              <div class="asset-badge" :style="{background:getSymbolColor(asset.symbol).bg,borderColor:getSymbolColor(asset.symbol).border,color:getSymbolColor(asset.symbol).text}">
                {{ asset.symbol.charAt(0) }}
              </div>
              <span class="font-semibold" style="color:var(--text-primary)">{{ asset.symbol }}</span>
            </div>
          </td>
          <td class="text-right font-mono" style="color:var(--text-secondary)">{{ asset.quantity.toLocaleString() }}</td>
          <td class="text-right font-mono" style="color:var(--text-muted)">${{ asset.averageBuyPrice.toLocaleString() }}</td>
          <td class="text-right font-mono font-semibold" style="color:var(--accent-3)">${{ asset.investedAmount.toLocaleString() }}</td>
          <td>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{width: getSharePercent(asset.investedAmount)+'%', background: getSymbolColor(asset.symbol).text}"></div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="!assets?.length" class="p-12 text-center">
        <div class="mx-auto mb-4" style="width:56px;height:56px;border-radius:14px;background:rgba(99,102,241,0.08);display:flex;align-items:center;justify-content:center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-7 h-7" style="color:var(--text-muted)"><path d="M1 4.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 2H3.25A2.25 2.25 0 001 4.25zM1 7.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 5H3.25A2.25 2.25 0 001 7.25zM7 8a1 1 0 011 1 2 2 0 104 0 1 1 0 011-1h3.75A2.25 2.25 0 0119 10.25v5.5A2.25 2.25 0 0116.75 18H3.25A2.25 2.25 0 011 15.75v-5.5A2.25 2.25 0 013.25 8H7z"/></svg>
        </div>
        <p class="font-semibold mb-1" style="color:var(--text-secondary)">No assets yet</p>
        <p class="text-sm" style="color:var(--text-muted)">Start trading to build your portfolio.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.asset-badge{width:34px;height:34px;border-radius:50%;border:1px solid;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0;transition:transform .2s ease}
.asset-row{animation:fadeInUp .4s ease-out forwards;opacity:0}
.asset-row:hover .asset-badge{transform:scale(1.1)}
.progress-bar-bg{width:100%;height:6px;border-radius:3px;background:rgba(99,102,241,0.08);overflow:hidden}
.progress-bar-fill{height:100%;border-radius:3px;transition:width .6s ease-out;opacity:.7}
</style>

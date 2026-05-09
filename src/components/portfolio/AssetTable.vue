<script setup lang="ts">
import type { Asset } from "@/types/portfolio";

defineProps<{
  assets: Asset[]
}>();
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

    <div class="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
      <div class="p-5 border-b border-gray-700 bg-gray-900/40">
        <h2 class="text-lg font-semibold text-white">Your Assets</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
          <tr class="bg-gray-950 border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
            <th class="p-4 font-medium">Asset</th>
            <th class="p-4 font-medium text-right">Quantity</th>
            <th class="p-4 font-medium text-right">Avg Buy Price</th>
            <th class="p-4 font-medium text-right">Invested</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
          <tr
              v-for="asset in assets"
              :key="asset.symbol"
              class="hover:bg-gray-700/50 transition-colors duration-150"
          >
            <td class="p-4 font-bold text-white">{{ asset.symbol }}</td>
            <td class="p-4 text-right text-gray-300">{{ asset.quantity.toLocaleString() }}</td>
            <td class="p-4 text-right font-mono text-gray-400">${{ asset.averageBuyPrice.toLocaleString() }}</td>
            <td class="p-4 text-right font-mono text-blue-400">${{ asset.investedAmount.toLocaleString() }}</td>
          </tr>
          </tbody>
        </table>

        <div v-if="!assets?.length" class="p-8 text-center text-gray-500">
          No assets found in your portfolio.
        </div>
      </div>
    </div>
</template>

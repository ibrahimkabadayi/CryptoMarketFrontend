<script setup lang="ts">
import type {Coin} from "@/types/market";

defineProps<{
  coins: Coin[]
}>();
</script>

<template>
  <div v-else class="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
    <table class="w-full text-left border-collapse">

      <thead>
      <tr class="bg-gray-950 border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
        <th class="p-4 font-medium">Name</th>
        <th class="p-4 font-medium">Symbol</th>
        <th class="p-4 font-medium text-right">Price</th>
        <th class="p-4 font-medium text-right">Market Cap</th>
      </tr>
      </thead>

      <tbody class="divide-y divide-gray-700">
      <tr
          v-for="coin in coins"
          :key="coin.symbol"
          class="hover:bg-gray-700 transition-colors duration-150"
      >

        <td class="p-4 font-semibold">{{ coin.name }}</td>
        <td class="p-4 text-gray-400">{{ coin.symbol }}</td>
        <td class="p-4 text-right font-mono text-green-400">${{ coin.currentPrice?.toLocaleString() || '0' }}</td>
        <td class="p-4 text-right font-mono">${{ coin.marketCap.toLocaleString() || '0' }}</td>
      </tr>
      </tbody>

    </table>

    <div v-if="coins.length === 0" class="p-8 text-center text-gray-400">
      No coins found in the market at this time.
    </div>
  </div>
</template>

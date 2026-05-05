<script setup lang="ts">
import {marketApi} from "@/api/market";
import {onMounted, ref} from "vue";
import type {Coin} from "@/types/market";

const coins = ref<Coin[]>();
const isLoading = ref(true);
const errorMessage = ref("");

const getCoins = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try
  {
    coins.value = await marketApi.getAllCoins();
  }
  catch (error)
  {
    console.error("Failed to fetch market data:", error);
    errorMessage.value = "Could not connect to the market server. Please try again later.";
  }
  finally
  {
    isLoading.value = false;
  }
}

const buyCoin = async (coin) => {
  try
  {

  }
  catch (error)
  {
    console.error(error);
  }
}

onMounted(() => {
  getCoins();
})

</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-6xl mx-auto">

      <!-- Page Header -->
      <h1 class="text-3xl font-bold mb-8">Cryptocurrency Market</h1>

      <!-- 1. Loading State: Shows while fetching data -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-400 text-lg">Loading market data...</p>
      </div>

      <!-- 2. Error State: Shows if the API request fails -->
      <div v-else-if="errorMessage" class="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
        {{ errorMessage }}
      </div>

      <!-- 3. Data Presentation: Shows the table when data is successfully loaded -->
      <div v-else class="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
        <table class="w-full text-left border-collapse">

          <!-- Table Header -->
          <thead>
          <tr class="bg-gray-950 border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
            <th class="p-4 font-medium">Name</th>
            <th class="p-4 font-medium">Symbol</th>
            <th class="p-4 font-medium text-right">Price</th>
            <th class="p-4 font-medium text-right">Market Cap</th>
          </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="divide-y divide-gray-700">
          <!--
            v-for DIRECTIVE: Loops through the 'coins' array.
            ':key' is required by Vue to uniquely identify each row (symbol is a good unique key).
          -->
          <tr
              v-for="coin in coins"
              :key="coin.symbol"
              class="hover:bg-gray-700 transition-colors duration-150"
          >
            <!-- Displaying data using double curly braces -->
            <td class="p-4 font-semibold">{{ coin.name }}</td>
            <td class="p-4 text-gray-400">{{ coin.symbol }}</td>
            <!-- Using .toLocaleString() to format numbers nicely (e.g., 50,000.00) -->
            <td class="p-4 text-right font-mono text-green-400">${{ coin.price.toLocaleString() }}</td>
            <td class="p-4 text-right font-mono">${{ coin.market_cap.toLocaleString() }}</td>
          </tr>
          </tbody>

        </table>

        <!-- Empty State: Shows if the API returns an empty array -->
        <div v-if="coins.length === 0" class="p-8 text-center text-gray-400">
          No coins found in the market at this time.
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>
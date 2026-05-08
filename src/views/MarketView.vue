<script setup lang="ts">
import {marketApi} from "@/api/market";
import {onMounted, ref} from "vue";
import type {Coin} from "@/types/market";
import CoinTable from "@/components/CoinTable.vue";

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

      <h1 class="text-3xl font-bold mb-8">Cryptocurrency Market</h1>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-400 text-lg">Loading market data...</p>
      </div>

      <div v-else-if="errorMessage" class="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
        {{ errorMessage }}
      </div>

      <CoinTable v-else :coins="coins">

      </CoinTable>
    </div>
  </div>

</template>

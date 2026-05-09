<script setup lang="ts">
import {onMounted, ref} from "vue";
import {portfolioApi} from "@/api/portfolio";
import {Dashboard} from "@/types/portfolio";
import AssetTable from "@/components/portfolio/AssetTable.vue";
import TransactionTable from "@/components/portfolio/TransactionTable.vue";

const dashboard = ref<Dashboard>()
const isLoading = ref(false);
const errorMessage = ref("");

const getDashboard = async () => {
  isLoading.value = true;

  try
  {
    dashboard.value = await portfolioApi.getDashboard();
  }
  catch (error)
  {
    console.error("Failed to fetch portfolio data:", error);
    errorMessage.value = error.message;
  }
  finally
  {
    isLoading.value = false;
  }
}

onMounted(() =>
{
  getDashboard();
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-6xl mx-auto">

      <h1 class="text-3xl font-bold mb-8">My Portfolio</h1>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-400 text-lg">Loading portfolio data...</p>
      </div>

      <div v-else-if="errorMessage" class="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
        {{ errorMessage }}
      </div>

      <div v-else-if="dashboard" class="space-y-8">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg flex flex-col justify-center">
            <h2 class="text-gray-400 text-sm uppercase tracking-wider mb-2">Fiat Balance</h2>
            <p class="text-4xl font-bold text-green-400">${{ dashboard.fiatBalance?.toLocaleString() || 0 }}</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg flex flex-col justify-center">
            <h2 class="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Invested Value</h2>
            <p class="text-4xl font-bold">${{ dashboard.totalInvestedValue?.toLocaleString() || 0 }}</p>
          </div>
        </div>

        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
          <div class="mb-4 md:mb-0">
            <h2 class="text-gray-400 text-sm uppercase tracking-wider mb-1">Wallet ID</h2>
            <p class="font-mono text-gray-200">{{ dashboard.walletId }}</p>
          </div>
          <div class="md:text-right">
            <h2 class="text-gray-400 text-sm uppercase tracking-wider mb-1">Wallet Address</h2>
            <p class="font-mono text-blue-400 break-all bg-gray-900 px-3 py-1 rounded-md border border-gray-700">
              {{ dashboard.address }}
            </p>
          </div>
        </div>

        <Asset-table :assets="dashboard.assets">

        </Asset-table>

        <TransactionTable :transactions="dashboard.recentTransactions">

        </TransactionTable>

      </div>
    </div>
  </div>
</template>
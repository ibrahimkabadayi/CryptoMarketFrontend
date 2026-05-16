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
  try {
    dashboard.value = await portfolioApi.getDashboard();
  } catch (error) {
    console.error("Failed to fetch portfolio data:", error);
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

const handleDeposit = () => alert('Deposit feature coming soon!');
const handleWithdraw = () => alert('Withdraw feature coming soon!');
const copyAddress = () => {
  if (dashboard.value?.address) navigator.clipboard.writeText(dashboard.value.address);
}

onMounted(() => { getDashboard(); })
</script>

<template>
  <div class="min-h-screen text-white p-6 md:p-8">
    <div class="max-w-7xl mx-auto">

      <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            My <span class="gradient-text">Portfolio</span>
          </h1>
          <p style="color: var(--text-secondary)" class="text-base">Monitor your assets, balances, and recent activity</p>
        </div>
        <div class="flex items-center space-x-3 mt-4 md:mt-0" v-if="!isLoading && dashboard">
          <button @click="handleDeposit" class="btn-gradient px-5 py-2.5 text-sm rounded-xl flex items-center space-x-2" id="deposit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"/></svg>
            <span>Deposit</span>
          </button>
          <button @click="handleWithdraw" class="btn-outline px-5 py-2.5 text-sm flex items-center space-x-2" id="withdraw-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd"/></svg>
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="animate-fade-in-up space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="glass-card-static p-6"><div class="shimmer mb-3" style="width:100px;height:12px"></div><div class="shimmer" style="width:180px;height:32px"></div></div>
          <div class="glass-card-static p-6"><div class="shimmer mb-3" style="width:120px;height:12px"></div><div class="shimmer" style="width:160px;height:32px"></div></div>
        </div>
        <div class="glass-card-static p-6"><div class="shimmer" style="width:300px;height:14px"></div></div>
        <div class="glass-card-static overflow-hidden">
          <div class="p-5" style="border-bottom:1px solid var(--border-subtle)"><div class="shimmer" style="width:100px;height:14px"></div></div>
          <div v-for="i in 4" :key="i" class="flex items-center space-x-6 p-5" :style="{borderBottom: i<4?'1px solid var(--border-subtle)':'none'}">
            <div class="shimmer" style="width:50px;height:14px"></div><div class="shimmer" style="width:80px;height:14px"></div>
            <div class="shimmer ml-auto" style="width:70px;height:14px"></div><div class="shimmer" style="width:90px;height:14px"></div>
          </div>
        </div>
      </div>

      <div v-else-if="errorMessage" class="animate-fade-in-up">
        <div class="glass-card p-8 text-center">
          <div class="mx-auto mb-4" style="width:56px;height:56px;border-radius:50%;background:rgba(239,68,68,0.1);display:flex;align-items:center;justify-content:center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" style="color:#f87171" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
          </div>
          <p class="text-lg font-semibold mb-2" style="color:#fca5a5">Failed to load portfolio</p>
          <p class="text-sm mb-6" style="color:var(--text-muted)">{{ errorMessage }}</p>
          <button @click="getDashboard" class="btn-outline px-6 py-2.5 text-sm">Try Again</button>
        </div>
      </div>

      <div v-else-if="dashboard" class="space-y-6">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up animate-delay-1">
          <div class="glass-card p-6 flex items-center space-x-5">
            <div class="stat-icon-lg" style="background:linear-gradient(135deg,rgba(16,185,129,0.15),rgba(52,211,153,0.08))">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6" style="color:#34d399"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.97 1.97 0 00-.483-.63 2.3 2.3 0 00-.7-.34v2.69l.032.008c.396.1.783.26 1.114.508.37.277.695.69.695 1.235 0 .545-.325.958-.695 1.235-.332.248-.718.408-1.114.508l-.032.008v.316a.75.75 0 01-1.5 0v-.316a3.78 3.78 0 01-1.653-.713 2.72 2.72 0 01-.925-1.2.75.75 0 011.395-.55c.12.303.338.557.483.63.217.11.472.19.7.34V7.147l-.032-.008c-.396-.1-.783-.26-1.114-.508C7.325 6.354 7 5.941 7 5.396c0-.545.325-.958.695-1.235.331-.248.718-.408 1.114-.508l.032-.008V4.75A.75.75 0 0110 4z" clip-rule="evenodd"/></svg>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider mb-1" style="color:var(--text-muted)">Fiat Balance</p>
              <p class="text-3xl font-bold" style="color:#34d399">${{ dashboard.fiatBalance?.toLocaleString(undefined,{minimumFractionDigits:2}) || '0.00' }}</p>
            </div>
          </div>
          <div class="glass-card p-6 flex items-center space-x-5">
            <div class="stat-icon-lg" style="background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08))">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6" style="color:var(--accent-3)"><path fill-rule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" clip-rule="evenodd"/></svg>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider mb-1" style="color:var(--text-muted)">Total Invested</p>
              <p class="text-3xl font-bold" style="color:var(--text-primary)">${{ dashboard.totalInvestedValue?.toLocaleString(undefined,{minimumFractionDigits:2}) || '0.00' }}</p>
            </div>
          </div>
        </div>

        <div class="wallet-card glass-card p-6 animate-fade-in-up animate-delay-2">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center space-x-4">
              <div class="wallet-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" style="color:var(--accent-3)"><path d="M1 4.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 2H3.25A2.25 2.25 0 001 4.25zM1 7.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 5H3.25A2.25 2.25 0 001 7.25zM7 8a1 1 0 011 1 2 2 0 104 0 1 1 0 011-1h3.75A2.25 2.25 0 0119 10.25v5.5A2.25 2.25 0 0116.75 18H3.25A2.25 2.25 0 011 15.75v-5.5A2.25 2.25 0 013.25 8H7z"/></svg></div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wider mb-1" style="color:var(--text-muted)">Wallet ID</p>
                <p class="font-mono text-sm" style="color:var(--text-secondary)">{{ dashboard.walletId }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="addr-box"><p class="font-mono text-xs break-all" style="color:var(--accent-3)">{{ dashboard.address }}</p></div>
              <button @click="copyAddress" class="copy-btn tooltip-wrapper" id="copy-address-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z"/><path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z"/></svg>
                <span class="tooltip-text">Copy address</span>
              </button>
            </div>
          </div>
        </div>

        <div class="animate-fade-in-up animate-delay-3"><AssetTable :assets="dashboard.assets" :totalInvested="dashboard.totalInvestedValue" /></div>
        <div class="animate-fade-in-up animate-delay-4"><TransactionTable :transactions="dashboard.recentTransactions" /></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-icon-lg{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.wallet-card{position:relative;overflow:hidden}
.wallet-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--gradient-primary);opacity:.5}
.wallet-icon{width:40px;height:40px;border-radius:10px;background:rgba(99,102,241,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.addr-box{background:rgba(10,14,26,.5);border:1px solid var(--border-subtle);border-radius:10px;padding:8px 14px;max-width:350px}
.copy-btn{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(99,102,241,.08);border:1px solid var(--border-subtle);color:var(--text-muted);cursor:pointer;transition:all .2s ease;flex-shrink:0}
.copy-btn:hover{color:var(--accent-3);background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.3)}
</style>
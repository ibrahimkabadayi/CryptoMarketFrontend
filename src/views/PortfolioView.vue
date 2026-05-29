<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { usePortfolioStore } from "@/stores/portfolioStore"
import AssetTable from "@/components/portfolio/AssetTable.vue";
import TransactionTable from "@/components/portfolio/TransactionTable.vue";
import { Download, Upload, Wallet, Copy, AlertTriangle, CircleDollarSign, Landmark } from 'lucide-vue-next';

const portfolioStore = usePortfolioStore();

const {dashboard, isLoading, errorMessage} = storeToRefs(portfolioStore)

const getDashboard = async () => {
  await portfolioStore.fetchDashboard();
}

const handleDeposit = async () => {
  const amountStr = prompt("Enter deposit amount:");
  if (!amountStr) return;
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  await portfolioStore.deposit(amount);
};

const handleWithdraw = async () => {
  const amountStr = prompt("Enter withdraw amount:");
  if (!amountStr) return;
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  if (amount > dashboard.value.fiatBalance){
    alert(`Not enough fiat!`);
    return;
  }
  await portfolioStore.withdraw(amount);
};

const handleCoinBought = async (symbol: string) => {
  const amountStr = prompt(`Enter amount of ${symbol} to buy:`);
  if (!amountStr) return;
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  await portfolioStore.buyCoin(symbol, amount);
};

const handleCoinSell = async (symbol: string) => {
  const amountStr = prompt(`Enter amount of ${symbol} to sell:`);
  if (!amountStr) return;
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  await portfolioStore.sellCoin(symbol, amount);
}

const copyAddress = () => {
  if (dashboard.value?.address) navigator.clipboard.writeText(dashboard.value.address);
}

onMounted(() => {
  getDashboard();
  portfolioStore.initPortfolioSignalR();
})
</script>

<template>
  <div class="min-h-screen text-white p-6 md:p-8 bg-matte-black">
    <div class="max-w-7xl mx-auto">

      <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-8 animate-fade-in-up border-b border-border-subtle pb-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 uppercase font-sans">
            Portfolio <span class="text-volt-green">Manager</span>
          </h1>
          <p class="text-sm font-mono text-text-secondary uppercase tracking-widest">> Monitor your assets, balances, and recent activity</p>
        </div>
        <div class="flex items-center space-x-3 mt-4 md:mt-0" v-if="!isLoading && dashboard">
          <button @click="handleDeposit()" class="btn-solid px-5 py-2.5 text-sm flex items-center space-x-2" id="deposit-btn">
            <Download :size="16" :stroke-width="2.5" />
            <span>Deposit</span>
          </button>
          <button @click="handleWithdraw()" class="btn-outline px-5 py-2.5 text-sm flex items-center space-x-2" id="withdraw-btn">
            <Upload :size="16" :stroke-width="2.5" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="animate-fade-in-up space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border-subtle bg-bg-surface">
          <div class="p-6 border-b md:border-b-0 md:border-r border-border-subtle bg-bg-deep"><div class="shimmer mb-3 w-24 h-3"></div><div class="shimmer w-40 h-8"></div></div>
          <div class="p-6 bg-bg-deep"><div class="shimmer mb-3 w-32 h-3"></div><div class="shimmer w-36 h-8"></div></div>
        </div>
        <div class="mono-card-static p-6"><div class="shimmer w-64 h-4"></div></div>
        <div class="mono-card-static overflow-hidden">
          <div class="p-5 border-b border-border-subtle bg-bg-deep"><div class="shimmer w-24 h-4"></div></div>
          <div v-for="i in 4" :key="i" class="flex items-center space-x-6 p-5 border-b border-border-subtle last:border-0">
            <div class="shimmer w-12 h-4"></div><div class="shimmer w-20 h-4"></div>
            <div class="shimmer ml-auto w-16 h-4"></div><div class="shimmer w-24 h-4"></div>
          </div>
        </div>
      </div>

      <div v-else-if="errorMessage" class="animate-fade-in-up">
        <div class="mono-card p-8 text-center border-red-500/50">
          <div class="mx-auto mb-4 w-12 h-12 flex items-center justify-center border border-red-500 bg-red-500/10 text-red-500 rounded-sm">
            <AlertTriangle :size="24" />
          </div>
          <p class="text-lg font-bold mb-2 uppercase text-red-400">Failed to load portfolio</p>
          <p class="text-sm font-mono mb-6 text-text-muted">{{ errorMessage }}</p>
          <button @click="getDashboard" class="btn-outline px-6 py-2.5 text-sm">Try Again</button>
        </div>
      </div>

      <div v-else-if="dashboard" class="space-y-6">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border-subtle bg-bg-surface animate-fade-in-up animate-delay-1">
          <div class="p-6 flex items-center space-x-5 border-b md:border-b-0 md:border-r border-border-subtle hover:bg-bg-hover transition-colors">
            <div class="stat-icon-lg bg-bg-deep border border-volt-green text-volt-green">
              <Landmark :size="24" />
            </div>
            <div>
              <p class="label-tech text-volt-green mb-1">Fiat Balance</p>
              <p class="text-3xl font-bold font-mono text-volt-green">${{ dashboard.fiatBalance?.toLocaleString(undefined,{minimumFractionDigits:2}) || '0.00' }}</p>
            </div>
          </div>
          <div class="p-6 flex items-center space-x-5 hover:bg-bg-hover transition-colors bg-bg-deep">
            <div class="stat-icon-lg bg-bg-deep border border-border-subtle text-white">
              <CircleDollarSign :size="24" />
            </div>
            <div>
              <p class="label-tech text-text-muted mb-1">Total Invested</p>
              <p class="text-3xl font-bold font-mono text-white">${{ dashboard.totalInvestedValue?.toLocaleString(undefined,{minimumFractionDigits:2}) || '0.00' }}</p>
            </div>
          </div>
        </div>

        <div class="wallet-card mono-card p-6 animate-fade-in-up animate-delay-2">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center space-x-4">
              <div class="wallet-icon border border-border-subtle bg-bg-deep text-text-primary">
                <Wallet :size="20" />
              </div>
              <div>
                <p class="label-tech mb-1 text-text-muted">Wallet ID</p>
                <p class="font-mono text-sm text-text-secondary">{{ dashboard.walletId }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="addr-box"><p class="font-mono text-xs break-all text-volt-green">{{ dashboard.address }}</p></div>
              <button @click="copyAddress" class="copy-btn tooltip-wrapper" id="copy-address-btn">
                <Copy :size="16" />
                <span class="tooltip-text">Copy address</span>
              </button>
            </div>
          </div>
        </div>

        <div class="animate-fade-in-up animate-delay-3"><AssetTable :assets="dashboard.assets" :totalInvested="dashboard.totalInvestedValue" @sell="handleCoinSell" @buy="handleCoinBought" /></div>
        <div class="animate-fade-in-up animate-delay-4"><TransactionTable :transactions="dashboard.recentTransactions" /></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-icon-lg {
  width: 52px;
  height: 52px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.wallet-card {
  border-top: 2px solid var(--volt-green);
  border-radius: 0;
  background: var(--bg-deep);
}
.wallet-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.addr-box {
  background: var(--bg-deep);
  border: 1px dashed var(--border-subtle);
  border-radius: 2px;
  padding: 8px 14px;
  max-width: 350px;
}
.copy-btn {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-deep);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  cursor: pointer;
  transition: all .15s ease;
  flex-shrink: 0;
}
.copy-btn:hover {
  color: var(--text-primary);
  border-color: var(--volt-green);
}
</style>
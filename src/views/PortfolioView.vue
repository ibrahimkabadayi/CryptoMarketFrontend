<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { usePortfolioStore } from "@/stores/portfolioStore"
import AssetTable from "@/components/portfolio/AssetTable.vue";
import TransactionTable from "@/components/portfolio/TransactionTable.vue";
import { Download, Upload, Wallet, Copy, AlertTriangle, CircleDollarSign, Landmark } from 'lucide-vue-next';

import { ref } from "vue";
const portfolioStore = usePortfolioStore();

const {dashboard, isLoading, errorMessage} = storeToRefs(portfolioStore)

const getDashboard = async () => {
  await portfolioStore.fetchDashboard();
}

// Transaction Modal State
const showTransactionModal = ref(false);
const transactionType = ref<'deposit'|'withdraw'>('deposit');
const transactionAmount = ref<number | ''>('');
const transactionError = ref('');
const isSubmitting = ref(false);

const openTransactionModal = (type: 'deposit'|'withdraw') => {
  transactionType.value = type;
  transactionAmount.value = '';
  transactionError.value = '';
  showTransactionModal.value = true;
};

const closeTransactionModal = () => {
  showTransactionModal.value = false;
};

const submitTransaction = async () => {
  const amount = Number(transactionAmount.value);
  if (!amount || amount <= 0) {
    transactionError.value = 'Please enter a valid positive amount.';
    return;
  }
  
  if (transactionType.value === 'withdraw' && dashboard.value) {
    if (amount > dashboard.value.fiatBalance) {
      transactionError.value = 'Not enough fiat balance for withdrawal.';
      return;
    }
  }

  isSubmitting.value = true;
  transactionError.value = '';

  try {
    if (transactionType.value === 'deposit') {
      await portfolioStore.deposit(amount);
    } else {
      await portfolioStore.withdraw(amount);
    }
    closeTransactionModal();
  } catch (error: any) {
    transactionError.value = error.message || 'Transaction failed.';
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeposit = () => openTransactionModal('deposit');
const handleWithdraw = () => openTransactionModal('withdraw');

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

    <!-- Transaction Modal -->
    <transition name="modal-fade">
      <div v-if="showTransactionModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div class="mono-card w-full max-w-md bg-bg-surface border-l-4" :class="transactionType === 'deposit' ? 'border-volt-green' : 'border-red-500'" @click.stop>
          <div class="p-6">
            <h2 class="text-xl font-extrabold mb-2 uppercase tracking-wider flex items-center gap-2">
              <Download v-if="transactionType === 'deposit'" :size="20" class="text-volt-green" />
              <Upload v-else :size="20" class="text-red-500" />
              {{ transactionType }} Fiat
            </h2>
            <p class="font-mono text-sm text-text-secondary mb-6">
              Available Balance: <span class="text-white">${{ dashboard?.fiatBalance?.toLocaleString(undefined,{minimumFractionDigits:2}) || '0.00' }}</span>
            </p>

            <div class="mb-6">
              <label class="label-tech mb-2 block text-text-secondary">Amount (USD)</label>
              <input
                v-model="transactionAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full px-4 py-3 bg-bg-deep border border-border-subtle text-white font-mono focus:outline-none transition-colors"
                :class="transactionType === 'deposit' ? 'focus:border-volt-green' : 'focus:border-red-500'"
                @keyup.enter="submitTransaction"
              />
            </div>

            <div v-if="transactionError" class="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-500 font-mono text-sm">
              ✗ {{ transactionError }}
            </div>

            <div class="flex gap-3">
              <button
                @click="closeTransactionModal"
                class="flex-1 px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest border border-border-subtle text-text-secondary hover:text-white hover:bg-bg-deep transition-all"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button
                @click="submitTransaction"
                :disabled="isSubmitting || !transactionAmount"
                class="flex-1 px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :class="transactionType === 'deposit'
                  ? 'bg-volt-green text-black border-volt-green hover:bg-transparent hover:text-volt-green'
                  : 'bg-red-500 text-black border-red-500 hover:bg-transparent hover:text-red-500'"
              >
                <span v-if="isSubmitting">Processing...</span>
                <span v-else>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
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

/* Modal Animations */
.modal-fade-enter-active {
  animation: modalFadeIn 0.2s ease-out forwards;
}

.modal-fade-leave-active {
  animation: modalFadeOut 0.15s ease-in forwards;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes modalFadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.98);
  }
}
</style>
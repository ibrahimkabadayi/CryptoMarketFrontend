<script setup lang="ts">
import type { Transaction } from "@/types/portfolio";

defineProps<{
  transactions: Transaction[]
}>();

const getTransactionTypeName = (type: number | string) => {
  const types = ['Sell', 'Buy', 'Transfer', 'Deposit', 'Withdraw'];
  if (typeof type === 'number' && type >= 0 && type < types.length) return types[type];
  return String(type).charAt(0).toUpperCase() + String(type).slice(1);
};

const getTransactionStyle = (type: number | string) => {
  if (type === 1 || type === 3 || type === 'buy' || type === 'deposit')
    return { bg: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'rgba(16,185,129,0.25)' };
  if (type === 0 || type === 4 || type === 'sell' || type === 'withdraw')
    return { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.25)' };
  return { bg: 'rgba(99,102,241,0.1)', color: '#818cf8', border: 'rgba(99,102,241,0.25)' };
};

const getTransactionIcon = (type: number | string) => {
  if (type === 1 || type === 'buy') return 'buy';
  if (type === 0 || type === 'sell') return 'sell';
  if (type === 3 || type === 'deposit') return 'deposit';
  if (type === 4 || type === 'withdraw') return 'withdraw';
  return 'transfer';
};
</script>

<template>
  <div class="glass-card-static overflow-hidden">
    <div class="flex items-center justify-between p-5" style="border-bottom:1px solid var(--border-subtle);background:rgba(10,14,26,0.3)">
      <h2 class="text-lg font-semibold" style="color:var(--text-primary)">Recent Transactions</h2>
      <span class="text-xs font-medium px-3 py-1 rounded-full" style="background:rgba(99,102,241,0.1);color:var(--accent-3)">
        {{ transactions?.length || 0 }} records
      </span>
    </div>

    <div class="overflow-x-auto">
      <table class="table-premium">
        <thead>
        <tr>
          <th>Type</th>
          <th>Asset</th>
          <th class="text-right">Amount</th>
          <th class="text-right">Price</th>
          <th class="text-right">Total</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(tx, index) in transactions" :key="index" class="tx-row" :style="{animationDelay:`${index*0.05}s`}">
          <td>
            <span class="tx-badge" :style="{background:getTransactionStyle(tx.transactionType).bg, color:getTransactionStyle(tx.transactionType).color, borderColor:getTransactionStyle(tx.transactionType).border}">
              <!-- Buy / Deposit arrow down -->
              <svg v-if="getTransactionIcon(tx.transactionType)==='buy'||getTransactionIcon(tx.transactionType)==='deposit'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3">
                <path fill-rule="evenodd" d="M8 2a.75.75 0 01.75.75v8.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 011.06-1.06l3.22 3.22V2.75A.75.75 0 018 2z" clip-rule="evenodd"/>
              </svg>
              <!-- Sell / Withdraw arrow up -->
              <svg v-else-if="getTransactionIcon(tx.transactionType)==='sell'||getTransactionIcon(tx.transactionType)==='withdraw'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3">
                <path fill-rule="evenodd" d="M8 14a.75.75 0 01-.75-.75V4.56L4.03 7.78a.75.75 0 01-1.06-1.06l4.5-4.5a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06L8.75 4.56v8.69A.75.75 0 018 14z" clip-rule="evenodd"/>
              </svg>
              <!-- Transfer arrows -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3">
                <path fill-rule="evenodd" d="M13.78 10.47a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 111.06-1.06l.97.97V6.75a.75.75 0 011.5 0v4.69l.97-.97a.75.75 0 011.06 0zM2.22 5.53a.75.75 0 010-1.06l2.25-2.25a.75.75 0 011.06 0l2.25 2.25a.75.75 0 01-1.06 1.06l-.97-.97v4.69a.75.75 0 01-1.5 0V4.56l-.97.97a.75.75 0 01-1.06 0z" clip-rule="evenodd"/>
              </svg>
              {{ getTransactionTypeName(tx.transactionType) }}
            </span>
          </td>
          <td class="font-semibold" style="color:var(--text-primary)">{{ tx.symbol }}</td>
          <td class="text-right font-mono" style="color:var(--text-secondary)">{{ tx.amount.toLocaleString() }}</td>
          <td class="text-right font-mono" style="color:var(--text-muted)">${{ tx.priceAtTransaction.toLocaleString() }}</td>
          <td class="text-right font-mono font-semibold" style="color:var(--text-primary)">
            ${{ (tx.amount * tx.priceAtTransaction).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}) }}
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="!transactions?.length" class="p-12 text-center">
        <div class="mx-auto mb-4" style="width:56px;height:56px;border-radius:14px;background:rgba(99,102,241,0.08);display:flex;align-items:center;justify-content:center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-7 h-7" style="color:var(--text-muted)"><path fill-rule="evenodd" d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z" clip-rule="evenodd"/></svg>
        </div>
        <p class="font-semibold mb-1" style="color:var(--text-secondary)">No transactions yet</p>
        <p class="text-sm" style="color:var(--text-muted)">Your trading history will appear here.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tx-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:.75rem;font-weight:600;border:1px solid}
.tx-row{animation:fadeInUp .4s ease-out forwards;opacity:0}
</style>
<script setup lang="ts">
import type { Transaction } from "@/types/portfolioTypes";
import { ArrowDownRight, ArrowUpRight, ArrowRightLeft, List } from 'lucide-vue-next';

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
    return { bg: 'var(--bg-deep)', color: 'var(--volt-green)', border: 'var(--volt-green)' };
  if (type === 0 || type === 4 || type === 'sell' || type === 'withdraw')
    return { bg: 'var(--bg-deep)', color: '#f87171', border: '#f87171' };
  return { bg: 'var(--bg-deep)', color: 'var(--text-primary)', border: 'var(--border-subtle)' };
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
  <div class="mono-card overflow-hidden">
    <div class="flex items-center justify-between p-5 border-b border-border-subtle bg-bg-deep">
      <h2 class="text-lg font-bold uppercase tracking-wider text-white">Transaction Log</h2>
      <span class="text-xs font-bold px-3 py-1 border border-border-subtle text-text-muted bg-bg-surface rounded-sm">
        {{ transactions?.length || 0 }} RECORDS
      </span>
    </div>

    <div class="overflow-x-auto">
      <table class="table-premium w-full text-left border-collapse">
        <thead>
        <tr>
          <th>Operation</th>
          <th>Asset</th>
          <th class="text-right">Volume</th>
          <th class="text-right">Price</th>
          <th class="text-right">Total Value</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(tx, index) in transactions" :key="index" class="tx-row hover:bg-bg-hover transition-colors" :style="{animationDelay:`${index*0.05}s`}">
          <td>
            <span class="tx-badge font-mono" :style="{background:getTransactionStyle(tx.transactionType).bg, color:getTransactionStyle(tx.transactionType).color, borderColor:getTransactionStyle(tx.transactionType).border}">
              <!-- Buy / Deposit arrow down -->
              <ArrowDownRight v-if="getTransactionIcon(tx.transactionType)==='buy'||getTransactionIcon(tx.transactionType)==='deposit'" :size="14" />
              <!-- Sell / Withdraw arrow up -->
              <ArrowUpRight v-else-if="getTransactionIcon(tx.transactionType)==='sell'||getTransactionIcon(tx.transactionType)==='withdraw'" :size="14" />
              <!-- Transfer arrows -->
              <ArrowRightLeft v-else :size="14" />
              {{ getTransactionTypeName(tx.transactionType).toUpperCase() }}
            </span>
          </td>
          <td class="font-bold text-white">{{ tx.symbol }}</td>
          <td class="text-right font-mono text-text-secondary">{{ tx.amount.toLocaleString() }}</td>
          <td class="text-right font-mono text-text-muted">${{ tx.priceAtTransaction.toLocaleString() }}</td>
          <td class="text-right font-mono font-bold text-white">
            ${{ (tx.amount * tx.priceAtTransaction).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}) }}
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="!transactions?.length" class="p-12 text-center border-t border-border-subtle bg-bg-surface">
        <div class="mx-auto mb-4 w-16 h-16 flex items-center justify-center border border-border-subtle bg-bg-deep text-text-muted">
          <List :size="32" />
        </div>
        <p class="font-bold mb-1 text-white uppercase tracking-wider">No Records Found</p>
        <p class="text-sm font-mono text-text-muted">System transaction log is empty.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tx-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 2px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid;
}
.tx-row {
  animation: fadeInUp .3s ease-out forwards;
  opacity: 0;
}
</style>
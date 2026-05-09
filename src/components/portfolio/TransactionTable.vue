<script setup lang="ts">
import type { Transaction } from "@/types/portfolio";

defineProps<{
  transactions: Transaction[]
}>();

const getTransactionTypeName = (type: number | string) =>
{
  const types = ['Sell', 'Buy', 'Transfer', 'Deposit', 'Withdraw'];
  if (typeof type === 'number' && type >= 0 && type < types.length)
  {
    return types[type];
  }

  return String(type).charAt(0).toUpperCase() + String(type).slice(1);
};

const getTransactionColorClass = (type: number | string) =>
{
  if (type === 1 || type === 3 || type === 'buy' || type === 'deposit')
  {
    return 'bg-green-900/50 text-green-400 border border-green-800';
  }
  else if (type === 0 || type === 4 || type === 'sell' || type === 'withdraw')
  {
    return 'bg-red-900/50 text-red-400 border border-red-800';
  }
  else
  {
    return 'bg-blue-900/50 text-blue-400 border border-blue-800';
  }
};

</script>

<template>
  <div class="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
    <div class="p-5 border-b border-gray-700 bg-gray-900/40">
      <h2 class="text-lg font-semibold text-white">Recent Transactions</h2>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
        <tr class="bg-gray-950 border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
          <th class="p-4 font-medium">Type</th>
          <th class="p-4 font-medium">Asset</th>
          <th class="p-4 font-medium text-right">Amount</th>
          <th class="p-4 font-medium text-right">Price</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
        <tr
            v-for="(tx, index) in transactions"
            :key="index"
            class="hover:bg-gray-700/50 transition-colors duration-150"
        >
          <td class="p-4">
                      <span
                          class="px-2.5 py-1 rounded text-xs font-bold"
                          :class="getTransactionColorClass(tx.transactionType)"
                      >
                        {{ getTransactionTypeName(tx.transactionType) }}
                      </span>
          </td>
          <td class="p-4 font-bold text-white">{{ tx.symbol }}</td>
          <td class="p-4 text-right text-gray-300">{{ tx.amount.toLocaleString() }}</td>
          <td class="p-4 text-right font-mono text-gray-400">${{ tx.priceAtTransaction.toLocaleString() }}</td>
        </tr>
        </tbody>
      </table>

      <div v-if="!transactions?.length" class="p-8 text-center text-gray-500">
        No recent transactions.
      </div>
    </div>
  </div>
</template>
<script setup>
import {useMarketNewsStore} from "@/stores/marketNewsStore.ts";
import NewsList from "@/components/market/NewsList.vue";
import {onMounted} from "vue";
import { Radio } from "lucide-vue-next";

const store = useMarketNewsStore();

onMounted(async () => {
    await store.fetchRecentNews();
    await store.initPortfolioSignalR();
});
</script>

<template>
  <div class="min-h-screen p-6 md:p-8 bg-matte-black text-white">
    <div class="max-w-5xl mx-auto">
      
      <!-- Page Header -->
      <div class="mb-8 animate-fade-in-up border-b border-border-subtle pb-6 flex items-center gap-4">
        <div class="w-16 h-16 border-2 border-volt-green flex items-center justify-center bg-bg-deep text-volt-green">
          <Radio :size="32" :stroke-width="1.5" />
        </div>
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-widest mb-2 uppercase">
            Market <span class="text-volt-green">Intel</span>
          </h1>
          <p class="text-sm font-mono text-text-secondary uppercase tracking-widest">
            > Live global intelligence feed
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="store.isLoading && store.news.length === 0" class="space-y-4">
        <div v-for="i in 5" :key="i" class="mono-card-static p-5 bg-bg-deep border border-border-subtle">
          <div class="shimmer h-6 w-3/4 mb-4"></div>
          <div class="shimmer h-4 w-full mb-2"></div>
          <div class="shimmer h-4 w-2/3"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="store.errorMessage" class="mono-card p-8 text-center border-red-500/50 bg-bg-surface">
        <p class="text-red-400 font-mono mb-4 uppercase tracking-widest">{{ store.errorMessage }}</p>
        <button @click="store.fetchRecentNews" class="btn-outline px-6 py-2">Reconnect Feed</button>
      </div>

      <!-- News List -->
      <div v-else class="animate-fade-in-up animate-delay-1">
        <NewsList :market-news="store.news" />
        
        <div v-if="store.news.length === 0" class="text-center py-20 mono-card bg-bg-surface border border-border-subtle">
          <p class="text-text-muted font-mono uppercase tracking-widest">No signals detected at this time.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-delay-1 {
  animation-delay: 0.1s;
}
</style>
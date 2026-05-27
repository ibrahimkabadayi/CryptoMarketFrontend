<script setup>
import {useMarketNewsStore} from "@/stores/marketNewsStore.ts";
import NewsList from "@/components/market/NewsList.vue";
import {onMounted} from "vue";

const store = useMarketNewsStore();

onMounted(async () => {
    await store.fetchRecentNews();
    await store.initPortfolioSignalR();
});
</script>

<template>
  <div class="min-h-screen text-white p-6 md:p-8">
    <div class="max-w-5xl mx-auto">
      
      <!-- Page Header -->
      <div class="mb-8 animate-fade-in-up">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          <span class="gradient-text">Market</span> News
        </h1>
        <p style="color: var(--text-secondary)" class="text-base">
          Latest updates and insights from the cryptocurrency world
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="store.isLoading && store.news.length === 0" class="space-y-4">
        <div v-for="i in 5" :key="i" class="glass-card p-5 animate-pulse">
          <div class="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-white/5 rounded w-full mb-2"></div>
          <div class="h-4 bg-white/5 rounded w-2/3"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="store.errorMessage" class="glass-card p-8 text-center">
        <p class="text-red-400 mb-4">{{ store.errorMessage }}</p>
        <button @click="store.fetchRecentNews" class="btn-outline px-6 py-2">Try Again</button>
      </div>

      <!-- News List -->
      <div v-else class="animate-fade-in-up animate-delay-1">
        <NewsList :market-news="store.news" />
        
        <div v-if="store.news.length === 0" class="text-center py-20 glass-card">
          <p class="text-gray-400">No news available at the moment.</p>
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
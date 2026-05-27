<script setup lang='ts'>
import {useMarketNewsStore} from "@/stores/marketNewsStore";
import {ref, onMounted} from "vue";
import type {MarketNews} from "@/types/marketNewsTypes";
import {useRoute, useRouter} from "vue-router";

const store = useMarketNewsStore();
const route = useRoute();
const router = useRouter();
const news = ref<MarketNews>();

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const goBack = () => {
  router.back();
};

onMounted(async () => {
  const title = String(route.params.title);
  
  if (store.news.length === 0) {
    await store.fetchRecentNews();
  }
  
  news.value = store.news.find(x => x.title === title);
});
</script>

<template>
  <div class="min-h-screen text-white p-6 md:p-8">
    <div class="max-w-4xl mx-auto">
      <button 
        @click="goBack" 
        class="mb-6 flex items-center text-sm text-gray-400 hover:text-white transition-colors group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to News
      </button>

      <div v-if="news" class="animate-fade-in-up">
        <div class="glass-card p-8 md:p-12">
          <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {{ news.source }}
            </span>
            <span class="text-sm text-gray-500">
              {{ formatDate(news.publishedAt) }}
            </span>
          </div>

          <h1 class="text-3xl md:text-4xl font-bold mb-8 leading-tight">
            {{ news.title }}
          </h1>

          <div class="prose prose-invert max-w-none">
            <p class="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {{ news.content }}
            </p>
          </div>

          <div class="mt-12 pt-8 border-t border-white/10">
            <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Related Assets</h4>
            <div class="flex flex-wrap gap-3">
              <router-link
                v-for="symbol in news.relatedSymbols"
                :key="symbol"
                :to="{ name: 'coin-detail', params: { symbol } }"
                class="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium"
              >
                {{ symbol }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="store.isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <div v-else class="text-center py-20 glass-card">
        <p class="text-gray-400">News article not found.</p>
        <button @click="goBack" class="mt-4 btn-outline px-6 py-2">Go Back</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose p {
  margin-bottom: 1.5em;
}
</style>
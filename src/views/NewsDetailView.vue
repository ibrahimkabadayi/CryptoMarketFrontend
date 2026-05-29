<script setup lang='ts'>
import {useMarketNewsStore} from "@/stores/marketNewsStore";
import {ref, onMounted} from "vue";
import type {MarketNews} from "@/types/marketNewsTypes";
import {useRoute, useRouter} from "vue-router";
import { ArrowLeft, Loader2 } from 'lucide-vue-next';

const store = useMarketNewsStore();
const route = useRoute();
const router = useRouter();
const news = ref<MarketNews>();

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
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
  <div class="min-h-screen text-white p-6 md:p-8 bg-matte-black">
    <div class="max-w-4xl mx-auto">
      <button 
        @click="goBack" 
        class="mb-6 flex items-center text-sm font-bold uppercase tracking-widest text-text-muted hover:text-volt-green transition-colors group"
      >
        <ArrowLeft :size="16" class="mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Return
      </button>

      <div v-if="news" class="animate-fade-in-up">
        <div class="mono-card p-8 md:p-12 border border-border-subtle bg-bg-surface">
          <div class="flex flex-wrap items-center gap-4 mb-8 border-b border-border-subtle pb-6">
            <span class="px-3 py-1 text-xs font-bold bg-bg-deep text-volt-green border border-volt-green uppercase tracking-widest">
              {{ news.source }}
            </span>
            <span class="text-xs font-mono text-text-secondary">
              {{ formatDate(news.publishedAt) }}
            </span>
          </div>

          <h1 class="text-3xl md:text-5xl font-extrabold mb-8 leading-tight uppercase tracking-wide text-white">
            {{ news.title }}
          </h1>

          <div class="prose prose-invert max-w-none">
            <p class="text-text-secondary font-mono text-lg leading-relaxed whitespace-pre-wrap">
              {{ news.content }}
            </p>
          </div>

          <div class="mt-12 pt-8 border-t border-border-subtle">
            <h4 class="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Related Assets</h4>
            <div class="flex flex-wrap gap-3">
              <router-link
                v-for="symbol in news.relatedSymbols"
                :key="symbol"
                :to="{ name: 'coin-detail', params: { symbol } }"
                class="px-4 py-2 bg-bg-deep border border-border-subtle hover:border-volt-green hover:text-volt-green transition-colors text-sm font-bold uppercase tracking-widest"
              >
                {{ symbol }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="store.isLoading" class="flex justify-center py-20 text-volt-green">
        <Loader2 :size="48" class="animate-spin" />
      </div>

      <div v-else class="text-center py-20 mono-card border border-border-subtle bg-bg-surface">
        <p class="text-text-muted font-mono uppercase tracking-widest mb-4">Intel file not found.</p>
        <button @click="goBack" class="btn-outline px-6 py-2 text-xs">Return</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose p {
  margin-bottom: 1.5em;
}
</style>
<script setup lang="ts">
import type {MarketNews} from "@/types/marketNewsTypes";
import { useRouter } from 'vue-router';

const props = defineProps<{
  marketNews: MarketNews[]
}>();

const router = useRouter();

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const goToDetail = (news: MarketNews) => {
  router.push({
    name: 'news-detail',
    params: { title: news.title }
  });
};
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="news in marketNews"
      :key="news.title"
      class="mono-card p-5 cursor-pointer hover:bg-bg-hover transition-colors group border border-border-subtle bg-bg-deep"
      @click="goToDetail(news)"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-bold text-white group-hover:text-volt-green transition-colors mb-2 uppercase tracking-wide">
            {{ news.title }}
          </h3>
          <p class="text-text-secondary font-mono text-sm line-clamp-2">
            {{ news.content }}
          </p>
        </div>
        <div class="flex flex-col items-end shrink-0">
          <span class="text-xs font-bold text-volt-green mb-1 uppercase tracking-widest">{{ news.source }}</span>
          <span class="text-xs font-mono text-text-muted">{{ formatDate(news.publishedAt) }}</span>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="symbol in news.relatedSymbols"
          :key="symbol"
          class="px-2 py-0.5 border border-volt-green text-volt-green text-[10px] font-bold uppercase tracking-widest bg-bg-surface"
        >
          {{ symbol }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Activity, PieChart, Newspaper, ArrowRight } from 'lucide-vue-next';

const router = useRouter();

const goMarket = () => {
  router.push('/market');
}

const goLogin = () => {
  router.push('/login');
}
</script>

<template>
  <div class="home-container min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-matte-black">
    <!-- Grid pattern background (Swiss/Blueprint feel) -->
    <div class="grid-pattern"></div>

    <div class="z-10 text-center max-w-5xl mx-auto animate-fade-in-up mt-12 mb-12">
      <div class="inline-flex items-center space-x-2 px-4 py-2 border border-volt-green bg-matte-grey mb-8 uppercase tracking-widest text-xs font-bold text-volt-green rounded-sm">
        <span class="pulse-dot"></span>
        <span>Terminal Online</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter text-white leading-tight uppercase">
        Market <span class="text-volt-green">Protocol</span>
      </h1>

      <p class="text-lg md:text-xl mb-10 mx-auto max-w-2xl font-mono text-text-secondary leading-relaxed">
        > SYSTEM_READY: Initialize real-time tracking, advanced portfolio management, and up-to-the-minute market data streams.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button @click="goMarket" class="btn-solid w-full sm:w-auto px-8 py-4 text-lg flex items-center justify-center gap-2">
          Execute Protocol
          <ArrowRight :size="20" :stroke-width="2.5" />
        </button>
        <button @click="goLogin" class="btn-outline w-full sm:w-auto px-8 py-4 text-lg flex items-center justify-center">
          Authenticate
        </button>
      </div>
      
      <!-- Stats/Features -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-0 mt-20 text-left border border-border-subtle bg-bg-surface">
        <div class="mono-card-home p-8 border-b md:border-b-0 md:border-r border-border-subtle hover:bg-bg-hover transition-colors">
          <div class="feature-icon mb-6">
            <Activity :size="32" :stroke-width="1.5" class="text-volt-green" />
          </div>
          <h3 class="text-lg font-bold text-white mb-2 uppercase tracking-wide">Real-Time Data</h3>
          <p class="text-sm font-mono text-text-secondary">Live updates on cryptocurrencies globally. Latency optimized.</p>
        </div>
        <div class="mono-card-home p-8 border-b md:border-b-0 md:border-r border-border-subtle hover:bg-bg-hover transition-colors">
          <div class="feature-icon mb-6">
            <PieChart :size="32" :stroke-width="1.5" class="text-volt-green" />
          </div>
          <h3 class="text-lg font-bold text-white mb-2 uppercase tracking-wide">Portfolio Sync</h3>
          <p class="text-sm font-mono text-text-secondary">Monitor metrics securely. Asset distribution algorithms active.</p>
        </div>
        <div class="mono-card-home p-8 hover:bg-bg-hover transition-colors">
          <div class="feature-icon mb-6">
            <Newspaper :size="32" :stroke-width="1.5" class="text-volt-green" />
          </div>
          <h3 class="text-lg font-bold text-white mb-2 uppercase tracking-wide">Market Feed</h3>
          <p class="text-sm font-mono text-text-secondary">Aggregated insight streams. Macro analysis ready.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: calc(100vh - 64px);
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, var(--border-subtle) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background-color: var(--volt-green);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

.feature-icon {
  display: inline-flex;
}

.mono-card-home {
  background: var(--bg-deep);
}
</style>

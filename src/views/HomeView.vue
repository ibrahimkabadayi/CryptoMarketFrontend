<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goMarket = () => {
  router.push('/market');
}

const goLogin = () => {
  router.push('/login');
}
</script>

<template>
  <div class="home-container min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="hero-orb hero-orb-3"></div>

    <div class="z-10 text-center max-w-5xl mx-auto animate-fade-in-up mt-12 mb-12">
      <div class="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge mb-8">
        <span class="pulse-dot"></span>
        <span class="text-sm font-medium" style="color: var(--accent-3)">Next Generation Crypto Platform</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight">
        Master the <span class="gradient-text">Crypto Market</span>
      </h1>

      <p class="text-lg md:text-xl mb-10 mx-auto max-w-2xl" style="color: var(--text-secondary)">
        Real-time tracking, advanced portfolio management, and up-to-the-minute market news. Your gateway to decentralized finance.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button @click="goMarket" class="btn-gradient w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-xl flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          Explore Market
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
        <button @click="goLogin" class="btn-glass w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-xl flex items-center justify-center transition-transform hover:scale-105">
          Sign In
        </button>
      </div>
      
      <!-- Stats/Features -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
        <div class="glass-card p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)]">
          <div class="feature-icon mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Real-Time Data</h3>
          <p class="text-sm leading-relaxed" style="color: var(--text-secondary)">Live updates on thousands of cryptocurrencies directly from the top exchanges globally.</p>
        </div>
        <div class="glass-card p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)]">
          <div class="feature-icon mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Portfolio Tracking</h3>
          <p class="text-sm leading-relaxed" style="color: var(--text-secondary)">Monitor your investments securely with advanced metrics and interactive performance charts.</p>
        </div>
        <div class="glass-card p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)]">
          <div class="feature-icon mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Market Insights</h3>
          <p class="text-sm leading-relaxed" style="color: var(--text-secondary)">Stay informed with the latest breaking news and detailed analysis from reliable sources.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: calc(100vh - 64px); /* assuming navbar is around 64px */
}

.glass-badge {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  backdrop-filter: blur(10px);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: var(--accent-3);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(167, 139, 250, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(167, 139, 250, 0);
  }
}

.btn-glass {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  color: var(--accent-3);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hero Orbs */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.5;
  pointer-events: none;
}

.hero-orb-1 {
  width: 500px;
  height: 500px;
  background: rgba(99, 102, 241, 0.4);
  top: -20%;
  left: -10%;
  animation: float 10s ease-in-out infinite;
}

.hero-orb-2 {
  width: 400px;
  height: 400px;
  background: rgba(139, 92, 246, 0.3);
  bottom: -10%;
  right: -10%;
  animation: float 8s ease-in-out infinite 2s;
}

.hero-orb-3 {
  width: 300px;
  height: 300px;
  background: rgba(56, 189, 248, 0.25);
  top: 40%;
  left: 40%;
  animation: float 12s ease-in-out infinite 4s;
}
</style>

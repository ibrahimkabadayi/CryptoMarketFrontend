<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('token');

  router.push('/');
};
</script>

<template>
  <nav class="bg-gray-800 border-b border-gray-700 px-6 py-4">
    <div class="max-w-6xl mx-auto flex justify-between items-center">

      <div class="flex items-center space-x-2">
        <span class="text-xl font-bold text-white tracking-tight">CryptoMarket</span>
      </div>

      <div class="flex items-center space-x-8">
        <router-link
            to="/market"
            class="text-gray-300 hover:text-white transition-colors font-medium"
            active-class="text-blue-500 font-semibold"
        >
          Market
        </router-link>

        <router-link
            to="/portfolio"
            class="text-gray-400 hover:text-white transition-colors font-medium"
            active-class="text-blue-500 font-semibold"
        >
          Portfolio
        </router-link>
      </div>

      <div class="flex items-center">
        <button
            @click="handleLogout"
            class="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
        >
          <span>Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

    </div>
  </nav>
</template>
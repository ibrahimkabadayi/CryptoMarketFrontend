<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-900">
    <NavBar v-if="route.name !== 'login'" />

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const route = useRoute();
</script>

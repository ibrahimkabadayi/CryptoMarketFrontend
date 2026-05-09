<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <NavBar />

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
</script>

<template>
  <div class="min-h-screen gradient-bg">
    <div class="sticky top-0 z-50">
      <NavBar />
    </div>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
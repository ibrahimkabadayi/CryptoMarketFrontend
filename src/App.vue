<!-- src/App.vue -->
<template>
  <!--
    The router-view component acts as a dynamic placeholder.
    Vue Router will automatically inject the correct component (e.g., LoginView) here based on the URL.
  -->
  <router-view></router-view>
</template>

<script setup lang="ts">
// No need to import LoginView here anymore, the router handles it!
</script>

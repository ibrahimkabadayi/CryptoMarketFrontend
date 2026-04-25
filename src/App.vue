<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from './api/axios';

const coins = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await apiClient.get('/api/Market/get_all_coins');
    coins.value = response.data;
    console.log("Başarılı! Gelen Veri:", response.data);
  } catch (error) {
    console.error("Coinler çekilirken hata oluştu:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <h1>Kripto Piyasası Bağlantı Testi</h1>

    <p v-if="isLoading">Backend'den veriler bekleniyor...</p>

    <pre v-else>{{ coins }}</pre>
  </div>
</template>

<style>

body {
  font-family: sans-serif;
  background-color: #1e1e1e;
  color: #fff;
  padding: 2rem;
}
pre {
  background-color: #2d2d2d;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}
</style>

<script setup lang="ts">

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '@/api/auth';
import type { LoginRequest } from '@/types/auth';

const router = useRouter();

const loginForm = ref<LoginRequest>({
  email: '',
  password: ''
});

const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try
  {
    const response = await authApi.login({
      email: loginForm.value.email,
      password: loginForm.value.password
    });

    console.log("Login successful! Token received:", response.token);

    localStorage.setItem('token', response.token);

    // TODO: Redirect the user to an authenticated page (e.g., Dashboard or Market)
    // router.push('/market');
  }
  catch (error:any)
  {
    console.log("Login failed", error);
    errorMessage.value = error.response?.data?.message || "Invalid credentials or server error. Please try again.";
  }
  finally
  {
    isLoading.value = false;
  }
}

</script>



<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">

    <div class="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">

      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">CryptoMarket</h1>
        <p class="text-gray-400">Sign in to your account</p>
      </div>

      <!-- Error Message Box -->
      <!-- 'v-if' ensures this div only renders when 'errorMessage' is not empty -->
      <div
          v-if="errorMessage"
          class="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm text-center flex items-center justify-center"
      >
        <!-- A simple SVG warning icon for better visuals -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ errorMessage }}
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">

        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
              type="email"
              id="email"
              v-model="loginForm.email"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
          >
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
              type="password"
              id="password"
              v-model="loginForm.password"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
          >
        </div>

        <!-- Submit Button -->
        <!-- ':disabled' makes the button unclickable when isLoading is true -->
        <!-- 'disabled:opacity-70 disabled:cursor-not-allowed' adds visual feedback using Tailwind -->
        <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex justify-center items-center"
        >
          <!-- Show loading spinner and text if isLoading is true -->
          <template v-if="isLoading">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </template>
          <!-- Show normal text if isLoading is false -->
          <template v-else>
            Sign In
          </template>
        </button>

      </form>

      <!-- Footer -->
      <div class="mt-6 text-center text-sm text-gray-400">
        Don't have an account?
        <a href="#" class="text-blue-500 hover:text-blue-400 font-medium">Sign Up</a>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
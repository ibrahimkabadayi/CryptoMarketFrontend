<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '@/api/authApi';
import type { LoginRequest } from '@/types/authTypes';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Hexagon, AlertTriangle } from 'lucide-vue-next';

const router = useRouter();

const loginForm = ref<LoginRequest>({
  email: '',
  password: ''
});

const isLoading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await authApi.login({
      email: loginForm.value.email,
      password: loginForm.value.password
    });

    console.log("Login successful! Token received:", response.token);

    localStorage.setItem('token', response.token);

    await router.push('/market');
  }
  catch (error:any) {
    console.log("Login failed", error);
    errorMessage.value = error.response?.data?.message || "Invalid credentials or server error. Please try again.";
  }
  finally {
    isLoading.value = false;
  }
}

const handleForgotPassword = () => {
  alert('Password reset offline. Contact administrator.');
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-matte-black relative overflow-hidden">
    <!-- Grid pattern background -->
    <div class="grid-pattern"></div>

    <div class="mono-card w-full max-w-md p-10 animate-fade-in-up relative z-10 bg-bg-surface">

      <!-- Logo & Header -->
      <div class="text-center mb-10 animate-fade-in-up animate-delay-1">
        <div class="logo-container mx-auto mb-5 border-2 border-volt-green flex items-center justify-center bg-bg-deep text-volt-green w-16 h-16">
          <Hexagon :size="36" :stroke-width="1.5" />
        </div>
        <h1 class="text-3xl font-extrabold text-white mb-2 tracking-widest uppercase">CryptoMarket</h1>
        <p class="text-xs font-mono tracking-widest text-text-secondary uppercase">> Authenticate session</p>
      </div>

      <!-- Error Message -->
      <div
          v-if="errorMessage"
          class="mb-6 p-4 text-xs font-mono text-center flex items-center justify-center animate-fade-in-up border border-red-500 bg-red-500/10 text-red-500 uppercase tracking-widest"
      >
        <AlertTriangle :size="16" class="mr-2 shrink-0" />
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">

        <!-- Email -->
        <div class="animate-fade-in-up animate-delay-2">
          <label for="login-email" class="block text-xs font-bold mb-2 uppercase tracking-widest text-text-secondary">
            User Identity (Email)
          </label>
          <div class="input-wrapper">
            <Mail class="input-icon" :size="16" />
            <input
                type="email"
                id="login-email"
                v-model="loginForm.email"
                required
                class="input-mono input-with-icon"
                placeholder="user@system.local"
            >
          </div>
        </div>

        <!-- Password -->
        <div class="animate-fade-in-up animate-delay-3">
          <label for="login-password" class="block text-xs font-bold mb-2 uppercase tracking-widest text-text-secondary">
            Access Cipher
          </label>
          <div class="input-wrapper">
            <Lock class="input-icon" :size="16" />
            <input
                :type="showPassword ? 'text' : 'password'"
                id="login-password"
                v-model="loginForm.password"
                required
                class="input-mono input-with-icon"
                placeholder="••••••••"
                style="padding-right: 48px;"
            >
            <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
                tabindex="-1"
            >
              <EyeOff v-if="!showPassword" :size="16" />
              <Eye v-else :size="16" />
            </button>
          </div>
        </div>

        <!-- Forgot Password -->
        <div class="text-right animate-fade-in-up animate-delay-3">
          <button
              type="button"
              @click="handleForgotPassword"
              class="text-xs font-mono font-medium transition-colors cursor-pointer bg-transparent border-none auth-link-muted hover:text-volt-green uppercase tracking-widest"
          >
            Recover Access?
          </button>
        </div>

        <!-- Submit Button -->
        <button
            type="submit"
            :disabled="isLoading"
            class="btn-solid w-full py-4 text-sm flex justify-center items-center animate-fade-in-up animate-delay-4 gap-2"
        >
          <template v-if="isLoading">
            <svg class="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </template>
          <template v-else>
            <span>Initialize</span>
            <ArrowRight :size="16" :stroke-width="3" />
          </template>
        </button>

      </form>

      <!-- Sign Up Link -->
      <div class="mt-8 text-center text-xs font-mono uppercase tracking-widest animate-fade-in-up animate-delay-5 text-text-muted border-t border-border-subtle pt-6">
        No authorization?
        <router-link to="/register" class="font-bold transition-colors ml-1 text-volt-green hover:text-white">Register Node</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.auth-link-muted {
  color: var(--text-muted);
}
.auth-link-muted:hover, .auth-link-muted:focus {
  color: var(--volt-green);
  outline: none;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
  transition: color 0.15s ease;
  z-index: 1;
}

.input-with-icon {
  padding-left: 42px !important;
}

.input-wrapper:focus-within .input-icon {
  color: var(--volt-green);
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.password-toggle:hover {
  color: var(--volt-green);
}
</style>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '@/api/authApi';
import type { LoginRequest } from '@/types/authTypes';

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
  alert('Password reset coming soon!');
}
</script>



<template>
  <div class="animated-bg min-h-screen flex items-center justify-center p-4">

    <!-- Floating decorative orbs -->
    <div class="login-orb login-orb-1"></div>
    <div class="login-orb login-orb-2"></div>
    <div class="login-orb login-orb-3"></div>

    <div class="glass-card w-full max-w-md p-10 animate-fade-in-up relative z-10">

      <!-- Logo & Header -->
      <div class="text-center mb-10 animate-fade-in-up animate-delay-1">
        <div class="logo-container mx-auto mb-5">
          <svg class="logo-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="50%" stop-color="#8b5cf6"/>
                <stop offset="100%" stop-color="#a78bfa"/>
              </linearGradient>
            </defs>
            <path d="M40 4L72.5 22V58L40 76L7.5 58V22L40 4Z" stroke="url(#logoGrad)" stroke-width="2.5" fill="rgba(99,102,241,0.08)"/>
            <text x="40" y="48" text-anchor="middle" fill="url(#logoGrad)" font-size="28" font-weight="700" font-family="Inter, sans-serif">₿</text>
          </svg>
        </div>
        <h1 class="text-3xl font-bold gradient-text mb-2 tracking-tight">CryptoMarket</h1>
        <p class="text-sm" style="color: var(--text-secondary)">Sign in to your trading account</p>
      </div>

      <!-- Error Message -->
      <div
          v-if="errorMessage"
          class="mb-6 p-4 rounded-xl text-sm text-center flex items-center justify-center animate-fade-in-up"
          style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25); color: #fca5a5;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">

        <!-- Email -->
        <div class="animate-fade-in-up animate-delay-2">
          <label for="login-email" class="block text-sm font-medium mb-2" style="color: var(--text-secondary)">
            Email Address
          </label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.161V6a2 2 0 00-2-2H3z"/>
              <path d="M19 8.839l-7.832 3.916a2.75 2.75 0 01-2.336 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"/>
            </svg>
            <input
                type="email"
                id="login-email"
                v-model="loginForm.email"
                required
                class="input-glass input-with-icon"
                placeholder="you@example.com"
            >
          </div>
        </div>

        <!-- Password -->
        <div class="animate-fade-in-up animate-delay-3">
          <label for="login-password" class="block text-sm font-medium mb-2" style="color: var(--text-secondary)">
            Password
          </label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"/>
            </svg>
            <input
                :type="showPassword ? 'text' : 'password'"
                id="login-password"
                v-model="loginForm.password"
                required
                class="input-glass input-with-icon"
                placeholder="••••••••"
                style="padding-right: 48px;"
            >
            <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
                tabindex="-1"
            >
              <!-- Eye open -->
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
                <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clip-rule="evenodd"/>
              </svg>
              <!-- Eye closed -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.092 1.092a4 4 0 00-5.558-5.558z" clip-rule="evenodd"/>
                <path d="M10.748 13.93l2.523 2.523A9.987 9.987 0 0110 17a10.004 10.004 0 01-9.336-6.41 1.651 1.651 0 010-1.186 10.007 10.007 0 012.862-4.014l1.66 1.66A4 4 0 0010.748 13.93z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Forgot Password -->
        <div class="text-right animate-fade-in-up animate-delay-3">
          <button
              type="button"
              @click="handleForgotPassword"
              class="text-xs font-medium transition-colors cursor-pointer bg-transparent border-none auth-link-muted"
          >
            Forgot password?
          </button>
        </div>

        <!-- Submit Button -->
        <button
            type="submit"
            :disabled="isLoading"
            class="btn-gradient w-full py-3.5 text-base rounded-xl flex justify-center items-center animate-fade-in-up animate-delay-4"
        >
          <template v-if="isLoading">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </template>
          <template v-else>
            <span>Sign In</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 4.5A1.5 1.5 0 014.5 3h4a.75.75 0 010 1.5h-4a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h4a.75.75 0 010 1.5h-4A1.5 1.5 0 013 15.5v-11zM14.22 9.47a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 11-1.06-1.06l.97-.97H7.75a.75.75 0 010-1.5h7.44l-.97-.97a.75.75 0 010-1.06z" clip-rule="evenodd"/>
            </svg>
          </template>
        </button>

      </form>

      <!-- Sign Up Link -->
      <div class="mt-8 text-center text-sm animate-fade-in-up animate-delay-5" style="color: var(--text-muted)">
        Don't have an account?
        <router-link to="/register" class="font-semibold transition-colors ml-1 auth-link-accent">Create Account</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo-container {
  width: 80px;
  height: 80px;
  animation: float 4s ease-in-out infinite;
}

.logo-icon {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.3));
}

.auth-link-muted {
  color: var(--text-muted);
}
.auth-link-muted:hover, .auth-link-muted:focus {
  color: #a78bfa;
  outline: none;
}

.auth-link-accent {
  color: var(--accent-3, #a78bfa);
}
.auth-link-accent:hover, .auth-link-accent:focus {
  color: #c4b5fd;
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
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
  transition: color 0.3s ease;
  z-index: 1;
}

.input-with-icon {
  padding-left: 42px !important;
}

.input-wrapper:focus-within .input-icon {
  color: var(--accent-3);
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
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: var(--text-primary);
}

/* Floating orbs */
.login-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.login-orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08), transparent 70%);
  top: 10%;
  left: 10%;
  animation: float 8s ease-in-out infinite;
}

.login-orb-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.06), transparent 70%);
  bottom: 20%;
  right: 15%;
  animation: float 6s ease-in-out infinite 2s;
}

.login-orb-3 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.05), transparent 70%);
  top: 60%;
  left: 60%;
  animation: float 10s ease-in-out infinite 4s;
}
</style>
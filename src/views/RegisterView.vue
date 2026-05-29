<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '@/api/authApi';
import type { RegisterRequest } from '@/types/authTypes';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Hexagon, AlertTriangle, CheckCircle } from 'lucide-vue-next';

const router = useRouter();

const registerForm = ref<RegisterRequest>({
  userName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const showPassword = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await authApi.register({
      userName: registerForm.value.userName,
      firstName: registerForm.value.firstName,
      lastName: registerForm.value.lastName,
      email: registerForm.value.email,
      password: registerForm.value.password
    });

    console.log("Registration successful!", response.message);
    successMessage.value = 'Registration successful! Proceeding to auth...';
    
    setTimeout(() => {
        router.push('/login');
    }, 2000);
  }
  catch (error:any) {
    console.log("Registration failed", error);
    errorMessage.value = error.response?.data?.message || "Registration failed. Verify input and retry.";
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-matte-black relative overflow-hidden">
    <!-- Grid pattern background -->
    <div class="grid-pattern"></div>

    <div class="mono-card w-full max-w-md p-10 animate-fade-in-up relative z-10 bg-bg-surface">

      <!-- Logo & Header -->
      <div class="text-center mb-8 animate-fade-in-up animate-delay-1">
        <div class="logo-container mx-auto mb-5 border-2 border-volt-green flex items-center justify-center bg-bg-deep text-volt-green w-16 h-16">
          <Hexagon :size="36" :stroke-width="1.5" />
        </div>
        <h1 class="text-3xl font-extrabold text-white mb-2 tracking-widest uppercase">CryptoMarket</h1>
        <p class="text-xs font-mono tracking-widest text-text-secondary uppercase">> Initialize new node</p>
      </div>

      <!-- Error Message -->
      <div
          v-if="errorMessage"
          class="mb-6 p-4 text-xs font-mono text-center flex items-center justify-center animate-fade-in-up border border-red-500 bg-red-500/10 text-red-500 uppercase tracking-widest"
      >
        <AlertTriangle :size="16" class="mr-2 shrink-0" />
        {{ errorMessage }}
      </div>

      <!-- Success Message -->
      <div
          v-if="successMessage"
          class="mb-6 p-4 text-xs font-mono text-center flex items-center justify-center animate-fade-in-up border border-volt-green bg-volt-green/10 text-volt-green uppercase tracking-widest"
      >
        <CheckCircle :size="16" class="mr-2 shrink-0" />
        {{ successMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">

        <!-- Username -->
        <div class="animate-fade-in-up animate-delay-2">
          <div class="input-wrapper">
            <User class="input-icon" :size="16" />
            <input
                type="text"
                id="register-username"
                v-model="registerForm.userName"
                required
                class="input-mono input-with-icon"
                placeholder="Alias_Name"
            >
          </div>
        </div>

        <!-- First & Last Name row -->
        <div class="grid grid-cols-2 gap-4 animate-fade-in-up animate-delay-2">
            <!-- First Name -->
            <div class="input-wrapper">
                <input
                    type="text"
                    id="register-firstname"
                    v-model="registerForm.firstName"
                    required
                    class="input-mono"
                    placeholder="First Name"
                >
            </div>
            
            <!-- Last Name -->
            <div class="input-wrapper">
                <input
                    type="text"
                    id="register-lastname"
                    v-model="registerForm.lastName"
                    required
                    class="input-mono"
                    placeholder="Last Name"
                >
            </div>
        </div>

        <!-- Email -->
        <div class="animate-fade-in-up animate-delay-3">
          <div class="input-wrapper">
            <Mail class="input-icon" :size="16" />
            <input
                type="email"
                id="register-email"
                v-model="registerForm.email"
                required
                class="input-mono input-with-icon"
                placeholder="user@system.local"
            >
          </div>
        </div>

        <!-- Password -->
        <div class="animate-fade-in-up animate-delay-3">
          <div class="input-wrapper">
            <Lock class="input-icon" :size="16" />
            <input
                :type="showPassword ? 'text' : 'password'"
                id="register-password"
                v-model="registerForm.password"
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

        <!-- Submit Button -->
        <button
            type="submit"
            :disabled="isLoading"
            class="btn-solid w-full py-4 mt-2 text-sm flex justify-center items-center animate-fade-in-up animate-delay-4 gap-2"
        >
          <template v-if="isLoading">
            <svg class="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </template>
          <template v-else>
            <span>Execute Registration</span>
            <ArrowRight :size="16" :stroke-width="3" />
          </template>
        </button>

      </form>

      <!-- Sign In Link -->
      <div class="mt-8 text-center text-xs font-mono uppercase tracking-widest animate-fade-in-up animate-delay-5 text-text-muted border-t border-border-subtle pt-6">
        Node already authorized?
        <router-link to="/login" class="font-bold transition-colors ml-1 text-volt-green hover:text-white">Authenticate</router-link>
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

.auth-link-accent {
  color: var(--volt-green);
}
.auth-link-accent:hover, .auth-link-accent:focus {
  color: #fff;
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

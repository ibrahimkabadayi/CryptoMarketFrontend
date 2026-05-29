<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/');
};

const navLinks = [
  { to: '/market', label: 'Market', icon: 'chart' },
  { to: '/portfolio', label: 'Portfolio', icon: 'wallet' },
];

const userInitial = computed(() => 'U');
</script>

<template>
  <nav class="navbar-glass">
    <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-3 group" style="text-decoration: none;">
        <div class="nav-logo">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="100%" stop-color="#a78bfa"/>
              </linearGradient>
            </defs>
            <path d="M18 2L32 10.5V27.5L18 36L4 27.5V10.5L18 2Z" stroke="url(#navLogoGrad)" stroke-width="1.8" fill="rgba(99,102,241,0.1)"/>
            <text x="18" y="23" text-anchor="middle" fill="url(#navLogoGrad)" font-size="14" font-weight="700" font-family="Inter, sans-serif">₿</text>
          </svg>
        </div>
        <span class="text-lg font-bold tracking-tight gradient-text">CryptoMarket</span>
      </router-link>

      <!-- Nav Links -->
      <div class="flex items-center space-x-1">
        <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="{ 'nav-link-active': route.path === link.to }"
        >
          <!-- Market Icon -->
          <svg v-if="link.icon === 'chart'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="nav-link-icon">
            <path fill-rule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.823 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75zM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373zm.177-9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 017.55 6zm3.175 2.25a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3zM13.3 8a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 0113.3 8z" clip-rule="evenodd"/>
          </svg>
          <!-- Portfolio Icon -->
          <svg v-if="link.icon === 'wallet'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="nav-link-icon">
            <path d="M1 4.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 2H3.25A2.25 2.25 0 001 4.25zM1 7.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 5H3.25A2.25 2.25 0 001 7.25zM7 8a1 1 0 011 1 2 2 0 104 0 1 1 0 011-1h3.75A2.25 2.25 0 0119 10.25v5.5A2.25 2.25 0 0116.75 18H3.25A2.25 2.25 0 011 15.75v-5.5A2.25 2.25 0 013.25 8H7z"/>
          </svg>
          <span>{{ link.label }}</span>
        </router-link>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-3">

        <!-- Notification Bell -->
        <div class="tooltip-wrapper">
          <button class="nav-icon-btn" id="notification-bell">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clip-rule="evenodd"/>
            </svg>
            <span class="notification-dot"></span>
          </button>
          <span class="tooltip-text">Notifications coming soon</span>
        </div>

        <!-- Divider -->
        <div class="nav-divider"></div>

        <!-- User Avatar -->
        <div class="tooltip-wrapper">
          <div class="user-avatar">
            {{ userInitial }}
          </div>
          <span class="tooltip-text">Profile settings coming soon</span>
        </div>

        <!-- Logout -->
        <button
            @click="handleLogout"
            class="nav-icon-btn logout-btn"
            id="logout-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar-glass {
  background: linear-gradient(180deg, rgba(15, 22, 41, 0.95), rgba(15, 22, 41, 0.85));
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border-subtle);
  z-index: 50;
}

.nav-logo {
  width: 36px;
  height: 36px;
  transition: transform 0.3s ease;
}

.group:hover .nav-logo {
  transform: rotate(8deg) scale(1.05);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(99, 102, 241, 0.06);
}

.nav-link-active {
  color: var(--accent-3) !important;
  background: rgba(99, 102, 241, 0.1) !important;
  font-weight: 600;
}

.nav-link-icon {
  width: 18px;
  height: 18px;
}

.nav-icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-icon-btn:hover {
  color: var(--text-primary);
  background: rgba(99, 102, 241, 0.08);
  border-color: var(--border-subtle);
}

.logout-btn:hover {
  color: #f87171 !important;
  background: rgba(239, 68, 68, 0.08) !important;
  border-color: rgba(239, 68, 68, 0.2) !important;
}

.notification-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gradient-primary);
  box-shadow: 0 0 6px rgba(99, 102, 241, 0.6);
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: var(--border-subtle);
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  border: 1px solid rgba(99, 102, 241, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-avatar:hover {
  border-color: var(--accent-1);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.2);
}
</style>
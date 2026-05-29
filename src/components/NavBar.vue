<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { LineChart, Wallet, Bell, LogOut, Hexagon } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/');
};

const navLinks = [
  { to: '/market', label: 'Market', icon: LineChart },
  { to: '/portfolio', label: 'Portfolio', icon: Wallet },
];

const userInitial = computed(() => 'U');
</script>

<template>
  <nav class="navbar-solid">
    <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-3 group" style="text-decoration: none;">
        <div class="nav-logo flex items-center justify-center">
          <Hexagon :size="24" class="text-volt-green" :stroke-width="2" />
        </div>
        <span class="text-lg font-bold tracking-widest text-white uppercase font-sans">CryptoMarket</span>
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
          <component :is="link.icon" :size="16" :stroke-width="2" class="nav-link-icon" />
          <span class="label-tech mt-0.5">{{ link.label }}</span>
        </router-link>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-3">

        <!-- Notification Bell -->
        <div class="tooltip-wrapper">
          <button class="nav-icon-btn" id="notification-bell">
            <Bell :size="18" :stroke-width="2" />
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
          <LogOut :size="18" :stroke-width="2" />
        </button>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar-solid {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  z-index: 50;
}

.nav-logo {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  background: var(--bg-deep);
  transition: all 0.15s ease;
}

.group:hover .nav-logo {
  border-color: var(--accent-1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.15s ease;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-deep);
}

.nav-link-active {
  color: var(--accent-1) !important;
  background: var(--bg-deep) !important;
  border: 1px solid var(--border-subtle);
}

.nav-link-active .label-tech {
  color: var(--accent-1);
}

.nav-link-icon {
  width: 16px;
  height: 16px;
}

.nav-icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.nav-icon-btn:hover {
  color: var(--text-primary);
  background: var(--bg-deep);
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
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-1);
}

.nav-divider {
  width: 1px;
  height: 20px;
  background: var(--border-subtle);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: var(--bg-deep);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.user-avatar:hover {
  border-color: var(--accent-1);
  color: var(--accent-1);
}
</style>
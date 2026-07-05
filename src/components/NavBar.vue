<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import { LineChart, Wallet, Bell, BellRing, LogOut, Hexagon } from 'lucide-vue-next';
import NotificationDropdown from '@/components/NotificationDropdown.vue';
import PriceAlertDropdown from '@/components/PriceAlertDropdown.vue';
import { useNotificationStore } from '@/stores/notificationStore';
import { usePriceAlertStore } from '@/stores/priceAlertStore';

const router = useRouter();
const route = useRoute();
const notificationStore = useNotificationStore();
const priceAlertStore = usePriceAlertStore();

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/');
};

const navLinks = [
  { to: '/market', label: 'Market', icon: LineChart },
  { to: '/portfolio', label: 'Portfolio', icon: Wallet },
];

const userInitial = computed(() => 'U');

const isLoggedIn = computed(() => !!localStorage.getItem('token'));

onMounted(async () => {
  if (isLoggedIn.value) {
    await Promise.all([
      notificationStore.init(),
      priceAlertStore.init()
    ]);
  }
});
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

        <!-- Price Alert Bell -->
        <div class="notif-bell-wrapper" style="position: relative;">
          <button
            class="nav-icon-btn"
            :class="{ 'nav-icon-btn-active': priceAlertStore.isDropdownOpen }"
            id="price-alert-bell"
            @click="priceAlertStore.toggleDropdown"
          >
            <BellRing :size="18" :stroke-width="2" />
            <span
              v-if="priceAlertStore.activeCount > 0"
              class="notification-badge alert-badge"
            >
              {{ priceAlertStore.activeCount > 99 ? '99+' : priceAlertStore.activeCount }}
            </span>
          </button>
          <PriceAlertDropdown />
        </div>

        <!-- Notification Bell -->
        <div class="notif-bell-wrapper" style="position: relative;">
          <button
            class="nav-icon-btn"
            :class="{ 'nav-icon-btn-active': notificationStore.isDropdownOpen }"
            id="notification-bell"
            @click="notificationStore.toggleDropdown"
          >
            <Bell :size="18" :stroke-width="2" />
            <span
              v-if="notificationStore.unreadCount > 0"
              class="notification-badge"
            >
              {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
            </span>
          </button>
          <NotificationDropdown />
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

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 2px;
  background: var(--accent-1);
  color: #000;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  pointer-events: none;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(223, 255, 0, 0.3); }
  50% { box-shadow: 0 0 0 4px rgba(223, 255, 0, 0); }
}

.nav-icon-btn-active {
  color: var(--accent-1) !important;
  background: var(--bg-deep) !important;
  border-color: var(--accent-1) !important;
}

.alert-badge {
  background: #60a5fa !important;
  animation-name: alertBadgePulse !important;
}

@keyframes alertBadgePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.3); }
  50% { box-shadow: 0 0 0 4px rgba(96, 165, 250, 0); }
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
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';
import { CheckCheck, Info, AlertTriangle, CircleCheck, Megaphone, X } from 'lucide-vue-next';
import type { NotificationDto } from '@/types/notificationTypes';

const store = useNotificationStore();
const dropdownRef = ref<HTMLElement | null>(null);

const getTypeIcon = (type: string) => {
  const t = type?.toLowerCase();
  if (t === 'warning' || t === 'alert') return AlertTriangle;
  if (t === 'success') return CircleCheck;
  if (t === 'announcement') return Megaphone;
  return Info;
};

const getTypeColor = (type: string) => {
  const t = type?.toLowerCase();
  if (t === 'warning' || t === 'alert') return '#f87171';
  if (t === 'success') return '#34d399';
  if (t === 'announcement') return '#DFFF00';
  return '#60a5fa';
};

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const handleNotificationClick = async (notification: NotificationDto) => {
  if (!notification.isRead) {
    await store.markAsRead(notification.id);
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    store.closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
  <div ref="dropdownRef" class="notif-dropdown-container">
    <transition name="notif-dropdown">
      <div v-if="store.isDropdownOpen" class="notif-dropdown" id="notification-dropdown">

        <!-- Header -->
        <div class="notif-header">
          <span class="notif-title">Notifications</span>
          <button
            v-if="store.unreadCount > 0"
            class="notif-mark-all-btn"
            @click="store.markAllAsRead"
            id="mark-all-read-btn"
          >
            <CheckCheck :size="14" :stroke-width="2" />
            <span>Mark all read</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="store.isLoading" class="notif-loading">
          <div class="notif-loading-bar"></div>
        </div>

        <!-- List -->
        <div class="notif-list" id="notification-list">
          <template v-if="store.sortedNotifications.length > 0">
            <div
              v-for="(notification, index) in store.sortedNotifications"
              :key="notification.id"
              class="notif-item"
              :class="{ 'notif-unread': !notification.isRead }"
              :style="{ animationDelay: `${index * 0.03}s` }"
              @click="handleNotificationClick(notification)"
            >
              <!-- Type icon -->
              <div class="notif-icon-wrap" :style="{ color: getTypeColor(notification.type) }">
                <component :is="getTypeIcon(notification.type)" :size="16" :stroke-width="2" />
              </div>

              <!-- Content -->
              <div class="notif-content">
                <div class="notif-item-header">
                  <span class="notif-item-title">{{ notification.title }}</span>
                  <span class="notif-time">{{ formatTimeAgo(notification.createdAt) }}</span>
                </div>
                <p class="notif-message">{{ notification.message }}</p>
              </div>

              <!-- Unread dot -->
              <div v-if="!notification.isRead" class="notif-unread-dot"></div>
            </div>
          </template>

          <!-- Empty -->
          <div v-else class="notif-empty">
            <Info :size="24" :stroke-width="1.5" class="notif-empty-icon" />
            <span class="notif-empty-text">No notifications</span>
            <span class="notif-empty-sub">You're all caught up</span>
          </div>
        </div>

      </div>
    </transition>
  </div>
</template>

<style scoped>
.notif-dropdown-container {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 200;
  width: 380px;
}

.notif-dropdown {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03);
}

/* Header */
.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-deep);
}

.notif-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

.notif-mark-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 2px;
  padding: 4px 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.notif-mark-all-btn:hover {
  border-color: var(--accent-1);
  color: var(--accent-1);
}

/* Loading */
.notif-loading {
  padding: 0;
  overflow: hidden;
}

.notif-loading-bar {
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--accent-1) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: loadingSlide 1.2s linear infinite;
}

@keyframes loadingSlide {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* List */
.notif-list {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-subtle) transparent;
}

.notif-list::-webkit-scrollbar {
  width: 4px;
}

.notif-list::-webkit-scrollbar-track {
  background: transparent;
}

.notif-list::-webkit-scrollbar-thumb {
  background: var(--border-subtle);
  border-radius: 0;
}

/* Item */
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: background 0.15s ease;
  animation: notifItemSlideIn 0.2s ease-out forwards;
  opacity: 0;
  position: relative;
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-item:hover {
  background: var(--bg-hover);
}

.notif-unread {
  background: rgba(223, 255, 0, 0.02);
}

.notif-unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--accent-1);
}

/* Icon */
.notif-icon-wrap {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: var(--bg-deep);
  border: 1px solid var(--border-subtle);
  margin-top: 1px;
}

/* Content */
.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.notif-item-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notif-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.notif-message {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Unread dot */
.notif-unread-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent-1);
  margin-top: 4px;
  box-shadow: 0 0 6px rgba(223, 255, 0, 0.4);
}

/* Empty state */
.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 8px;
}

.notif-empty-icon {
  color: var(--text-muted);
  margin-bottom: 4px;
}

.notif-empty-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.notif-empty-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-muted);
}

/* Animations */
@keyframes notifItemSlideIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dropdown transition */
.notif-dropdown-enter-active {
  animation: notifDropdownIn 0.2s ease-out forwards;
}

.notif-dropdown-leave-active {
  animation: notifDropdownOut 0.15s ease-in forwards;
}

@keyframes notifDropdownIn {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes notifDropdownOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
}
</style>

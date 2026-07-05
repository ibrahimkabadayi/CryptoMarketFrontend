<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { usePriceAlertStore } from '@/stores/priceAlertStore';
import { TrendingUp, TrendingDown, X, Eye, EyeOff, Plus } from 'lucide-vue-next';
import type { PriceAlertDto } from '@/types/priceAlertTypes';

const store = usePriceAlertStore();
const dropdownRef = ref<HTMLElement | null>(null);

// Create form state
const showCreateForm = ref(false);
const newSymbol = ref('');
const newTargetPrice = ref<number | ''>('');
const newIsAbove = ref(true);
const isSubmitting = ref(false);
const successMessage = ref('');

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(value);
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

const handleDeactivate = async (alert: PriceAlertDto) => {
  await store.deactivateAlert(alert.id);
};

const handleCreateAlert = async () => {
  if (!newSymbol.value || !newTargetPrice.value) return;

  isSubmitting.value = true;
  const success = await store.createAlert(
    newSymbol.value.toUpperCase(),
    Number(newTargetPrice.value),
    newIsAbove.value
  );

  if (success) {
    successMessage.value = `Alert set for ${newSymbol.value.toUpperCase()}`;
    newSymbol.value = '';
    newTargetPrice.value = '';
    newIsAbove.value = true;
    showCreateForm.value = false;

    setTimeout(() => { successMessage.value = ''; }, 3000);
  }
  isSubmitting.value = false;
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
  <div ref="dropdownRef" class="alert-dropdown-container">
    <transition name="alert-dropdown">
      <div v-if="store.isDropdownOpen" class="alert-dropdown" id="price-alert-dropdown">

        <!-- Header -->
        <div class="alert-header">
          <span class="alert-title">Price Alerts</span>
          <div class="alert-header-actions">
            <button
              class="alert-toggle-btn"
              @click="store.toggleShowAll"
              :title="store.showAllAlerts ? 'Show active only' : 'Show all alerts'"
            >
              <Eye v-if="!store.showAllAlerts" :size="14" :stroke-width="2" />
              <EyeOff v-else :size="14" :stroke-width="2" />
              <span>{{ store.showAllAlerts ? 'Active' : 'All' }}</span>
            </button>
            <button
              class="alert-create-btn"
              @click="showCreateForm = !showCreateForm"
            >
              <Plus :size="14" :stroke-width="2.5" />
            </button>
          </div>
        </div>

        <!-- Success message -->
        <div v-if="successMessage" class="alert-success-bar">
          {{ successMessage }}
        </div>

        <!-- Error message -->
        <div v-if="store.errorMessage" class="alert-error-bar">
          {{ store.errorMessage }}
        </div>

        <!-- Create Form -->
        <transition name="alert-form">
          <div v-if="showCreateForm" class="alert-create-form">
            <div class="alert-form-row">
              <input
                v-model="newSymbol"
                type="text"
                placeholder="Symbol (e.g. BTC)"
                class="alert-input"
                id="alert-symbol-input"
              />
              <input
                v-model="newTargetPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="Target $"
                class="alert-input"
                id="alert-price-input"
              />
            </div>
            <div class="alert-form-row">
              <div class="alert-direction-toggle">
                <button
                  class="alert-dir-btn"
                  :class="{ 'alert-dir-btn-active-above': newIsAbove }"
                  @click="newIsAbove = true"
                >
                  <TrendingUp :size="12" :stroke-width="2.5" />
                  <span>Above</span>
                </button>
                <button
                  class="alert-dir-btn"
                  :class="{ 'alert-dir-btn-active-below': !newIsAbove }"
                  @click="newIsAbove = false"
                >
                  <TrendingDown :size="12" :stroke-width="2.5" />
                  <span>Below</span>
                </button>
              </div>
              <button
                class="alert-submit-btn"
                @click="handleCreateAlert"
                :disabled="isSubmitting || !newSymbol || !newTargetPrice"
                id="alert-submit-btn"
              >
                {{ isSubmitting ? '...' : 'Set Alert' }}
              </button>
            </div>
          </div>
        </transition>

        <!-- Loading -->
        <div v-if="store.isLoading" class="alert-loading">
          <div class="alert-loading-bar"></div>
        </div>

        <!-- List -->
        <div class="alert-list" id="price-alert-list">
          <template v-if="store.sortedAlerts.length > 0">
            <div
              v-for="(alert, index) in store.sortedAlerts"
              :key="alert.id"
              class="alert-item"
              :class="{ 'alert-inactive': !alert.isActive }"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <!-- Direction icon -->
              <div
                class="alert-icon-wrap"
                :class="alert.isAbove ? 'alert-icon-above' : 'alert-icon-below'"
              >
                <TrendingUp v-if="alert.isAbove" :size="16" :stroke-width="2" />
                <TrendingDown v-else :size="16" :stroke-width="2" />
              </div>

              <!-- Content -->
              <div class="alert-content">
                <div class="alert-item-header">
                  <span class="alert-symbol">{{ alert.symbol }}</span>
                  <span class="alert-time">{{ formatTimeAgo(alert.createdAt) }}</span>
                </div>
                <div class="alert-details">
                  <span class="alert-direction-label">
                    {{ alert.isAbove ? '▲ Above' : '▼ Below' }}
                  </span>
                  <span class="alert-target-price">{{ formatCurrency(alert.targetPrice) }}</span>
                </div>
              </div>

              <!-- Status / Deactivate -->
              <div class="alert-actions">
                <span v-if="!alert.isActive" class="alert-status-inactive">Triggered</span>
                <button
                  v-else
                  class="alert-deactivate-btn"
                  @click.stop="handleDeactivate(alert)"
                  title="Deactivate alert"
                >
                  <X :size="14" :stroke-width="2" />
                </button>
              </div>
            </div>
          </template>

          <!-- Empty -->
          <div v-else class="alert-empty">
            <TrendingUp :size="24" :stroke-width="1.5" class="alert-empty-icon" />
            <span class="alert-empty-text">No price alerts</span>
            <span class="alert-empty-sub">Set alerts to track price movements</span>
          </div>
        </div>

      </div>
    </transition>
  </div>
</template>

<style scoped>
.alert-dropdown-container {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 200;
  width: 380px;
}

.alert-dropdown {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03);
}

/* Header */
.alert-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-deep);
}

.alert-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

.alert-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.alert-toggle-btn,
.alert-create-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 2px;
  padding: 4px 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.alert-toggle-btn:hover,
.alert-create-btn:hover {
  border-color: var(--accent-1);
  color: var(--accent-1);
}

/* Success / Error bars */
.alert-success-bar {
  padding: 8px 16px;
  background: rgba(52, 211, 153, 0.08);
  border-bottom: 1px solid rgba(52, 211, 153, 0.2);
  color: #34d399;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: notifItemSlideIn 0.2s ease-out forwards;
}

.alert-error-bar {
  padding: 8px 16px;
  background: rgba(248, 113, 113, 0.08);
  border-bottom: 1px solid rgba(248, 113, 113, 0.2);
  color: #f87171;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 600;
}

/* Create Form */
.alert-create-form {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-deep);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-form-row {
  display: flex;
  gap: 8px;
}

.alert-input {
  flex: 1;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 2px;
  padding: 8px 10px;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  outline: none;
  transition: border-color 0.15s ease;
}

.alert-input::placeholder {
  color: var(--text-muted);
}

.alert-input:focus {
  border-color: var(--accent-1);
}

.alert-direction-toggle {
  display: flex;
  gap: 4px;
  flex: 1;
}

.alert-dir-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 8px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 2px;
  color: var(--text-muted);
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.alert-dir-btn:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}

.alert-dir-btn-active-above {
  background: rgba(52, 211, 153, 0.1) !important;
  border-color: #34d399 !important;
  color: #34d399 !important;
}

.alert-dir-btn-active-below {
  background: rgba(248, 113, 113, 0.1) !important;
  border-color: #f87171 !important;
  color: #f87171 !important;
}

.alert-submit-btn {
  padding: 6px 14px;
  background: var(--accent-1);
  border: 1px solid var(--accent-1);
  border-radius: 2px;
  color: #000;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.alert-submit-btn:hover {
  background: var(--accent-2);
}

.alert-submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Loading */
.alert-loading {
  padding: 0;
  overflow: hidden;
}

.alert-loading-bar {
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
.alert-list {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-subtle) transparent;
}

.alert-list::-webkit-scrollbar {
  width: 4px;
}

.alert-list::-webkit-scrollbar-track {
  background: transparent;
}

.alert-list::-webkit-scrollbar-thumb {
  background: var(--border-subtle);
  border-radius: 0;
}

/* Item */
.alert-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
  transition: background 0.15s ease;
  animation: notifItemSlideIn 0.2s ease-out forwards;
  opacity: 0;
  position: relative;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-item:hover {
  background: var(--bg-hover);
}

.alert-inactive {
  opacity: 0.45;
}

/* Icon */
.alert-icon-wrap {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: var(--bg-deep);
  border: 1px solid var(--border-subtle);
}

.alert-icon-above {
  color: #34d399;
  border-color: rgba(52, 211, 153, 0.3);
}

.alert-icon-below {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

/* Content */
.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.alert-symbol {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
}

.alert-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.alert-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert-direction-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.alert-target-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-1);
}

/* Actions */
.alert-actions {
  flex-shrink: 0;
}

.alert-status-inactive {
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  padding: 2px 6px;
  border: 1px solid var(--border-subtle);
  border-radius: 2px;
}

.alert-deactivate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 2px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.alert-deactivate-btn:hover {
  border-color: #f87171;
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
}

/* Empty state */
.alert-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 8px;
}

.alert-empty-icon {
  color: var(--text-muted);
  margin-bottom: 4px;
}

.alert-empty-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.alert-empty-sub {
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
.alert-dropdown-enter-active {
  animation: alertDropdownIn 0.2s ease-out forwards;
}

.alert-dropdown-leave-active {
  animation: alertDropdownOut 0.15s ease-in forwards;
}

@keyframes alertDropdownIn {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes alertDropdownOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
}

/* Form transition */
.alert-form-enter-active {
  animation: formSlideIn 0.2s ease-out forwards;
}

.alert-form-leave-active {
  animation: formSlideOut 0.15s ease-in forwards;
}

@keyframes formSlideIn {
  from {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
  to {
    opacity: 1;
    max-height: 120px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
}

@keyframes formSlideOut {
  from {
    opacity: 1;
    max-height: 120px;
  }
  to {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Settings, Edit, History, Settings2, Download, Upload } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'action', type: 'edit' | 'history' | 'backup' | 'restore'): void;
}>();

const isOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleAction = (type: 'edit' | 'history' | 'backup' | 'restore') => {
  emit('action', type);
  isOpen.value = false;
};
</script>

<template>
  <div class="settings-menu" ref="menuRef">
    <button class="menu-trigger" @click="toggleMenu" aria-label="Settings">
      <Settings :size="24" />
    </button>

    <Transition name="fade">
      <div v-if="isOpen" class="menu-dropdown">
        <button @click="handleAction('edit')">
          <Edit :size="18" />
          <span>编辑积分</span>
        </button>
        <button @click="handleAction('history')">
          <History :size="18" />
          <span>历史记录</span>
        </button>
        <div class="menu-divider"></div>
        <button @click="handleAction('backup')">
          <Download :size="18" />
          <span>备份数据</span>
        </button>
        <button @click="handleAction('restore')">
          <Upload :size="18" />
          <span>恢复数据</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.settings-menu {
  position: relative;
}

.menu-trigger {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: var(--card-bg);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.menu-trigger:hover {
  background: var(--bg-color);
  color: var(--primary-color);
}

.menu-dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 8px;
  min-width: 160px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-dropdown button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  width: 100%;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.menu-dropdown button:hover {
  background: var(--bg-color);
  color: var(--primary-color);
}

.menu-divider {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}
</style>

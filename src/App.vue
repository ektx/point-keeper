<script setup lang="ts">
import { ref } from 'vue';
import { usePoints } from './hooks/usePoints';
import SettingsMenu from './components/SettingsMenu.vue';
import PointEditModal from './components/PointEditModal.vue';
import HistoryList from './components/HistoryList.vue';
import { Loader2 } from 'lucide-vue-next';

const { 
  stats, 
  sortedRecords, 
  loading, 
  error, 
  addPoint, 
  backupData, 
  restoreData 
} = usePoints();

const showEditModal = ref(false);
const showHistory = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const handleAction = (type: string) => {
  if (type === 'edit') showEditModal.value = true;
  if (type === 'history') showHistory.value = true;
  if (type === 'backup') backupData();
  if (type === 'restore') fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const success = await restoreData(input.files[0]);
    if (success) {
      alert('数据恢复成功');
    } else {
      alert('数据恢复失败，请检查文件格式');
    }
  }
};

const handleEditSubmit = async (data: any) => {
  if (loading.value) return;
  try {
    await addPoint(data);
  } catch (e) {
    alert('保存失败，请重试');
  }
};

const handleDoubleClick = () => {
  showEditModal.value = true;
};
</script>

<template>
  <div class="app-container" @dblclick="handleDoubleClick">
    <header class="app-header">
      <div class="logo">PointKeeper</div>
      <SettingsMenu @action="handleAction" />
    </header>

    <main class="main-content">
      <div class="points-display">
        <h2 class="label">当前积分</h2>
        <div class="total-points" @dblclick.stop="handleDoubleClick">
          {{ stats.total }}
        </div>
      </div>

      <div class="quick-actions">
        <button class="action-btn" @click="showEditModal = true">
          立即操作
        </button>
      </div>
    </main>

    <input 
      type="file" 
      ref="fileInput" 
      style="display: none" 
      accept=".json" 
      @change="handleFileChange"
    />

    <PointEditModal 
      :show="showEditModal" 
      @close="showEditModal = false"
      @submit="handleEditSubmit"
    />

    <HistoryList 
      :show="showHistory" 
      :records="sortedRecords"
      :stats="stats"
      @close="showHistory = false"
    />

    <Transition name="fade">
      <div v-if="loading" class="global-loading">
        <Loader2 class="spin" :size="48" />
      </div>
    </Transition>

    <div v-if="error" class="error-toast">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.logo {
  font-weight: 800;
  font-size: 20px;
  color: var(--primary-color);
  letter-spacing: -0.5px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 100px;
}

.points-display {
  text-align: center;
  margin-bottom: 40px;
}

.label {
  font-size: 16px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 8px;
}

.total-points {
  font-size: 120px;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: -4px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease;
}

.total-points:hover {
  transform: scale(1.02);
}

.quick-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  background: var(--primary-color);
  color: white;
  padding: 14px 32px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  background: var(--primary-hover);
}

.global-loading {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.spin {
  animation: spin 1s linear infinite;
  color: var(--primary-color);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--danger-color);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  z-index: 2000;
}

@media (max-width: 768px) {
  .total-points {
    font-size: 80px;
    letter-spacing: -2px;
  }
}
</style>

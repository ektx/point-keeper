<script setup lang="ts">
import { X, TrendingUp, TrendingDown, ClipboardList } from 'lucide-vue-next';
import type { PointRecord, PointStats } from '../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

defineProps<{
  show: boolean;
  records: PointRecord[];
  stats: PointStats;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const formatTime = (ts: number) => {
  return format(ts, 'yyyy-MM-dd HH:mm', { locale: zhCN });
};
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="history-overlay" @click.self="emit('close')">
      <div class="history-panel">
        <div class="history-header">
          <div class="header-title">
            <ClipboardList :size="20" />
            <h3>历史记录</h3>
          </div>
          <button @click="emit('close')" class="close-btn">
            <X :size="20" />
          </button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">总条数</span>
            <span class="stat-value">{{ records.length }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">总获得</span>
            <span class="stat-value add">+{{ stats.addTotal }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">总消耗</span>
            <span class="stat-value use">-{{ stats.useTotal }}</span>
          </div>
        </div>

        <div class="records-list">
          <div v-if="records.length === 0" class="empty-state">
            暂无记录
          </div>
          <div 
            v-for="record in records" 
            :key="record.id" 
            class="record-item"
          >
            <div class="record-icon" :class="record.type">
              <TrendingUp v-if="record.type === 'add'" :size="16" />
              <TrendingDown v-else :size="16" />
            </div>
            <div class="record-info">
              <div class="record-main">
                <span class="record-remark">{{ record.remark || (record.type === 'add' ? '添加积分' : '使用积分') }}</span>
                <span class="record-value" :class="record.type">
                  {{ record.type === 'add' ? '+' : '-' }}{{ record.value }}
                </span>
              </div>
              <div class="record-time">{{ formatTime(record.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.history-overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.history-panel {
  background: var(--bg-color);
  width: 100%;
  max-width: 450px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 10px rgba(0,0,0,0.1);
}

.history-header {
  padding: 20px;
  background: var(--card-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
}

.stat-card {
  background: var(--card-bg);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.stat-value {
  font-weight: 700;
  font-size: 16px;
}

.stat-value.add { color: var(--success-color); }
.stat-value.use { color: var(--danger-color); }

.records-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  background: var(--card-bg);
  padding: 12px;
  border-radius: 10px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.record-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-icon.add { background: #dcfce7; color: var(--success-color); }
.record-icon.use { background: #fee2e2; color: var(--danger-color); }

.record-info {
  flex: 1;
}

.record-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-remark {
  font-weight: 500;
  font-size: 14px;
}

.record-value {
  font-weight: 700;
}

.record-value.add { color: var(--success-color); }
.record-value.use { color: var(--danger-color); }

.record-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.close-btn {
  color: var(--text-secondary);
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .history-panel {
    max-width: 100%;
  }
}
</style>

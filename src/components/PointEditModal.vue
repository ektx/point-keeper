<script setup lang="ts">
import { ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import type { PointOperationType } from '../types';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: { value: number; type: PointOperationType; remark: string; timestamp: number }): void;
}>();

const value = ref<number | ''>('');
const type = ref<PointOperationType>('add');
const remark = ref('');
const datetime = ref(new Date().toISOString().slice(0, 16));

const errors = ref({
  value: '',
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    value.value = '';
    type.value = 'add';
    remark.value = '';
    datetime.value = new Date().toISOString().slice(0, 16);
    errors.value.value = '';
  }
});

const handleSubmit = () => {
  if (!value.value || value.value <= 0) {
    errors.value.value = '请输入大于0的数字';
    return;
  }

  emit('submit', {
    value: Number(value.value),
    type: type.value,
    remark: remark.value,
    timestamp: new Date(datetime.value).getTime(),
  });
  emit('close');
};
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="emit('close')">
      <Transition name="slide-up" appear>
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ type === 'add' ? '添加积分' : '使用积分' }}</h3>
            <button @click="emit('close')" class="close-btn">
              <X :size="20" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="modal-body">
            <div class="form-group">
              <label>操作类型</label>
              <div class="type-selector">
                <button 
                  type="button" 
                  :class="{ active: type === 'add' }" 
                  @click="type = 'add'"
                >
                  添加
                </button>
                <button 
                  type="button" 
                  :class="{ active: type === 'use' }" 
                  @click="type = 'use'"
                >
                  使用
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>积分数值</label>
              <input 
                v-model.number="value" 
                type="number" 
                placeholder="请输入积分值" 
                required
                min="1"
              />
              <span v-if="errors.value" class="error-msg">{{ errors.value }}</span>
            </div>

            <div class="form-group">
              <label>时间</label>
              <input 
                v-model="datetime" 
                type="datetime-local" 
                required
              />
            </div>

            <div class="form-group">
              <label>备注 (可选)</label>
              <textarea 
                v-model="remark" 
                maxlength="200" 
                placeholder="添加备注..."
                rows="3"
              ></textarea>
              <div class="char-count">{{ remark.length }}/200</div>
            </div>

            <div class="modal-footer">
              <button type="button" @click="emit('close')" class="btn-secondary">取消</button>
              <button type="submit" class="btn-primary">确认完成</button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: var(--card-bg);
  width: 100%;
  max-width: 400px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: var(--bg-color);
  padding: 4px;
  border-radius: 8px;
}

.type-selector button {
  padding: 8px;
  border-radius: 6px;
  font-weight: 500;
  color: var(--text-secondary);
}

.type-selector button.active {
  background: var(--card-bg);
  color: var(--primary-color);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.error-msg {
  color: var(--danger-color);
  font-size: 12px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: var(--text-secondary);
}

.modal-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
}

.btn-secondary {
  background: var(--bg-color);
  color: var(--text-primary);
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
}

.close-btn {
  color: var(--text-secondary);
}
</style>

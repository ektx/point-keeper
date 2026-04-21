import { ref, computed, onMounted } from 'vue';
import type { PointRecord, PointStats } from '../types';
import { storageService } from '../services/storage';

export function usePoints() {
  const records = ref<PointRecord[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const refreshData = () => {
    loading.value = true;
    try {
      records.value = storageService.getRecords();
      error.value = null;
    } catch (e) {
      error.value = 'Failed to load data';
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const stats = computed<PointStats>(() => {
    let total = 0;
    let addCount = 0;
    let useCount = 0;
    let addTotal = 0;
    let useTotal = 0;

    records.value.forEach(r => {
      if (r.type === 'add') {
        total += r.value;
        addCount++;
        addTotal += r.value;
      } else {
        total -= r.value;
        useCount++;
        useTotal += r.value;
      }
    });

    return { total, addCount, useCount, addTotal, useTotal };
  });

  const sortedRecords = computed(() => {
    return [...records.value].sort((a, b) => b.timestamp - a.timestamp);
  });

  const addPoint = async (data: Omit<PointRecord, 'id' | 'timestamp'> & { timestamp?: number }) => {
    loading.value = true;
    try {
      storageService.addRecord(data);
      refreshData();
    } catch (e) {
      error.value = 'Failed to add record';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const backupData = () => {
    const data = storageService.backup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `point_keeper_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restoreData = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const success = storageService.restore(content);
        if (success) {
          refreshData();
        }
        resolve(success);
      };
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  };

  onMounted(() => {
    refreshData();
  });

  return {
    records,
    sortedRecords,
    stats,
    loading,
    error,
    addPoint,
    refreshData,
    backupData,
    restoreData,
  };
}

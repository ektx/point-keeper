import type { PointRecord, PointStats } from '../types';

const STORAGE_KEY = 'point_keeper_records';

export const storageService = {
  getRecords(): PointRecord[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse storage data', e);
      return [];
    }
  },

  saveRecords(records: PointRecord[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  addRecord(record: Omit<PointRecord, 'id' | 'timestamp'> & { timestamp?: number }): PointRecord {
    const records = this.getRecords();
    const newRecord: PointRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: record.timestamp || Date.now(),
    };
    records.push(newRecord);
    this.saveRecords(records);
    return newRecord;
  },

  updateRecord(updatedRecord: PointRecord) {
    const records = this.getRecords();
    const index = records.findIndex(r => r.id === updatedRecord.id);
    if (index !== -1) {
      records[index] = updatedRecord;
      this.saveRecords(records);
    }
  },

  deleteRecord(id: string) {
    const records = this.getRecords();
    const filtered = records.filter(r => r.id !== id);
    this.saveRecords(filtered);
  },

  getStats(): PointStats {
    const records = this.getRecords();
    let total = 0;
    let addCount = 0;
    let useCount = 0;
    let addTotal = 0;
    let useTotal = 0;

    records.forEach(r => {
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
  },

  backup(): string {
    const records = this.getRecords();
    return JSON.stringify(records);
  },

  restore(json: string): boolean {
    try {
      const records = JSON.parse(json);
      if (Array.isArray(records)) {
        this.saveRecords(records);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to restore data', e);
      return false;
    }
  }
};

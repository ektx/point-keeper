import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from './storage';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should start with empty records', () => {
    expect(storageService.getRecords()).toEqual([]);
  });

  it('should add a record and calculate stats correctly', () => {
    storageService.addRecord({
      value: 100,
      type: 'add',
      remark: 'Test add',
    });

    const stats = storageService.getStats();
    expect(stats.total).toBe(100);
    expect(stats.addTotal).toBe(100);
    expect(stats.addCount).toBe(1);

    storageService.addRecord({
      value: 30,
      type: 'use',
      remark: 'Test use',
    });

    const newStats = storageService.getStats();
    expect(newStats.total).toBe(70);
    expect(newStats.useTotal).toBe(30);
    expect(newStats.useCount).toBe(1);
  });

  it('should handle backup and restore', () => {
    storageService.addRecord({ value: 50, type: 'add', remark: 'B1' });
    const backup = storageService.backup();
    
    localStorage.clear();
    expect(storageService.getRecords()).toEqual([]);
    
    const success = storageService.restore(backup);
    expect(success).toBe(true);
    expect(storageService.getRecords().length).toBe(1);
    expect(storageService.getRecords()[0].value).toBe(50);
  });

  it('should handle negative points correctly (boundary condition)', () => {
    // Adding 10 then using 20 should result in -10
    storageService.addRecord({ value: 10, type: 'add', remark: 'A' });
    storageService.addRecord({ value: 20, type: 'use', remark: 'B' });
    
    const stats = storageService.getStats();
    expect(stats.total).toBe(-10);
  });
});

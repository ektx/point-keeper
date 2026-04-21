export type PointOperationType = 'add' | 'use';

export interface PointRecord {
  id: string;
  value: number;
  type: PointOperationType;
  remark: string;
  timestamp: number;
}

export interface PointStats {
  total: number;
  addCount: number;
  useCount: number;
  addTotal: number;
  useTotal: number;
}

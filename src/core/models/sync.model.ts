import { Timestamp } from 'firebase/firestore';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';
export type OperationType = 
  'updateProgress' | 
  'addBookmark' | 
  'deleteAnnotation' |
  'updateBookStatus';

export interface DeviceInfo {
  model: string;
  os: string;
  appVersion: string;
  timezone: string;
}

export interface PendingOperation {
  operationType: OperationType;
  bookId: string;
  percent?: number;
  timestamp: Timestamp;
}

export interface DeviceModel {
  deviceId: string;
  lastSync: Timestamp;
  deviceInfo: DeviceInfo;
  pendingOperations?: PendingOperation[];
}
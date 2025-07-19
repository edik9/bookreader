import { Timestamp } from 'firebase/firestore';

export type AccountType = 'guest' | 'registered' | 'migrated';

export interface UserPreferences {
  ui: {
    theme: 'light' | 'dark' | 'system';
    fontSize: number;
    language: string;
    showPageNumbers?: boolean;
  };
  reading?: {
    scrollMode: 'paged' | 'scroll';
    defaultFont?: string;
    lineSpacing?: number;
    nightMode?: boolean;
  };
  notifications?: {
    remindersEnabled: boolean;
    dailyGoalMinutes?: number;
  };
}

export interface UserStats {
  reading?: {
    totalBooksRead: number;
    totalReadingTimeMinutes: number;
    averageReadingSessionMinutes: number;
    currentStreakDays: number;
    longestStreakDays: number;
  };
  library?: {
    totalBooksAdded: number;
    favoriteBooksCount: number;
    abandonedBooksCount: number;
  };
  lastActivity?: {
    lastLoginAt: Timestamp;
    lastReadAt?: Timestamp;
  };
}

export interface MigrationData {
  sourceDeviceId: string;
  migratedAt: Timestamp;
  importedCollections: boolean;
  importedBooks: boolean;
}

export interface UserModel {
  email?: string;
  displayName?: string;
  createdAt: Timestamp;
  lastActiveAt: Timestamp;
  accountType: AccountType;
  deviceId?: string;
  isGuest: boolean;
  preferences: UserPreferences;
  stats?: UserStats;
  migration?: MigrationData;
}
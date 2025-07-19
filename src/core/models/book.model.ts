import { Timestamp } from 'firebase/firestore';

export interface BookMetadata {
  language: string;
  genres: string[];
  publisher?: string;
  localizedTitles?: Record<string, string>;
}

export interface BookStatus {
  isFavorite: boolean;
  isRead: boolean;
  isAbandoned: boolean;
}

export interface ReadingPosition {
  percent: number;
  updatedAt: Timestamp;
  deviceType?: string;
}

export interface BookProgress {
  percent: number;
  currentChapter?: string;
  lastPosition: Record<string, ReadingPosition>;
  daysSpent?: number;
}

export interface BookStats {
  lastRead?: Timestamp;
  totalReadingTimeMinutes?: number;
}

export interface BookModel {
  title: string;
  author: string;
  fileStoragePath: string;
  fileFormat: 'epub' | 'pdf' | 'mobi' | 'fb2';
  fileSizeMB: number;
  metadata: BookMetadata;
  status: BookStatus;
  progress: BookProgress;
  stats?: BookStats;
  rating?: number;
  coverStoragePath?: string;
}
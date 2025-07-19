import { Timestamp } from 'firebase/firestore';

export interface ReadingSessionModel {
  date: string; // Формат "YYYY-MM-DD"
  durationMinutes: number;
  pagesRead: number;
}
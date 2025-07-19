import { Timestamp } from 'firebase/firestore';

export interface SearchIndexModel {
  bookId: string;
  text: string;
  tags: string[];
  genres: string[];
  updatedAt: Timestamp;
}
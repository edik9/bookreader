import { Timestamp } from 'firebase/firestore';

export interface CollectionModel {
  name: string;
  coverUrl?: string;
  createdAt: Timestamp;
  isPublic: boolean;
}
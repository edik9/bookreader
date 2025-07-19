import { Timestamp } from 'firebase/firestore';

export interface TagModel {
  name: string;
  createdAt: Timestamp;
}
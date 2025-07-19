import { Timestamp } from 'firebase/firestore';

export type AnnotationType = 'highlight' | 'note' | 'bookmark';
export type AnnotationVisibility = 'private' | 'shared' | 'public';

export interface AnnotationColor {
  hex: string;
  name: string;
}

export interface AnnotationContent {
  text: string;
  page: number;
  chapterId?: string;
}

export interface AnnotationHistoryItem {
  updatedAt: Timestamp;
  updatedByDevice: string;
  contentDiff: {
    text?: string;
  };
}

export interface AnnotationModel {
  bookId: string;
  type: AnnotationType;
  content: AnnotationContent;
  color?: AnnotationColor;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedByDevice: string;
  visibility: AnnotationVisibility;
  version: number;
}
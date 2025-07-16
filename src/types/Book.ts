export interface Book {
  id?: string;
  title: string;
  author: string;
  description: string;
  categories: string[];
  fileUrl: string;
  coverUrl?: string;
  createdAt?: Date;
  uploadedBy?: string;
}
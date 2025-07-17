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
  fileType?: 'epub' | 'pdf' | 'fb2'; 
}

export interface BookContent {
  chapters: Chapter[];
  metadata: {
    title: string;
    author: string;
    description?: string;
  };
}

export interface Chapter {
  title: string;
  content: string;
}
// Экспорт из firebase.ts
export { 
  firebaseApp, 
  auth, 
  db, 
  storage,
  booksCollection,
  genresCollection,
  usersCollection,
  getBookRef,
  getUserRef,
  type Book,
  type Genre,
  type UserProfile
} from './firebase';

// Экспорт сервисов
export * from './auth.service';
export * from './books.service';
export * from './collections.service';
export * from './data.service';
export * from './firestore.service';

// Экспорт типов
export type { AuthError} from './auth.service'
export type { FirestoreError } from './firestore.service'
export type { UploadResult } from './data.service'
export type { PaginatedBooksResult } from './books.service'
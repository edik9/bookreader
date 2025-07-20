import { initializeApp, getApps } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import type { Auth } from "firebase/auth";
import {
  getFirestore,
  Firestore,
  collection,
  DocumentReference,
  QueryDocumentSnapshot,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import type { DocumentData, WithFieldValue, FirestoreDataConverter } from "firebase/firestore"
import { getStorage } from "firebase/storage";
import { doc } from "firebase/firestore"
import type { FirebaseStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// проверка конфигурации
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error("Missing Firebase configuration");
}

let firebaseApp: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage

if (!getApps().length) {
  try {
    firebaseApp = initializeApp(firebaseConfig)
    auth = getAuth(firebaseApp)
    db = getFirestore(firebaseApp)
    storage = getStorage(firebaseApp)

    if (import.meta.env.DEV) {
      console.log("Firebase initialized in development mode")
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
} else {
  firebaseApp = getApps()[0]
  auth = getAuth(firebaseApp)
  db = getFirestore(firebaseApp)
  storage = getStorage(firebaseApp)
}

// Generic конвертер для типизации коллекций
const createConverter = <T extends { id: string }>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: WithFieldValue<T>) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest} = data
    return rest
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>) => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      ...data
    } as T
  }
})

// Определение типов и коллекций
export interface Book {
  id: string;
  title: string;
  author: string;
  genreId: string;
  publishedAt: Date;
  coverUrl?: string;
  rating?: number;
  searchKeywords?: string[];
}

export interface Genre {
  id: string;
  name: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    fontSize: number;
  };
}

export const booksCollection = collection(db, "books").withConverter(createConverter<Book>())
export const genresCollection = collection(db, "genres").withConverter(createConverter<Genre>())
export const usersCollection = collection(db, "users").withConverter(createConverter<UserProfile>())

export const getBookRef = (id: string) => doc(db, "books", id).withConverter(createConverter<Book>())
export const getUserRef = (id: string) => doc(db, "users", id).withConverter(createConverter<UserProfile>())

export { 
  firebaseApp, 
  auth, 
  db, 
  storage,
  type DocumentReference,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type DocumentSnapshot
};
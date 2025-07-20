import {
  genresCollection,
  type Genre
} from "./firebase";

import type {
  Unsubscribe,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";

import {
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  addDoc
} from "firebase/firestore";

let genresCache: Genre[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

// Конвертер для Genre
const genreConverter: FirestoreDataConverter<Genre> = {
  toFirestore(genre: Genre): DocumentData {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = genre;
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Genre {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data
    } as Genre;
  }
};

export async function getGenres(forceRefresh = false): Promise<Genre[]> {
  const now = Date.now();

  if (!forceRefresh && genresCache && cacheTimestamp && now - cacheTimestamp < CACHE_TTL_MS) {
    return genresCache;
  }

  try {
    const snapshot = await getDocs(genresCollection.withConverter(genreConverter));
    genresCache = snapshot.docs.map(doc => doc.data());
    cacheTimestamp = now;
    return genresCache;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
}

export function watchGenres(
  callback: (genres: Genre[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    genresCollection.withConverter(genreConverter),
    (snapshot) => {
      genresCache = snapshot.docs.map(doc => doc.data());
      cacheTimestamp = Date.now();
      callback(genresCache);
    },
    (error) => {
      console.error("Genres subscription error:", error);
      onError?.(new Error("Failed to watch genres"));
    }
  );
}

export async function getGenreById(id: string): Promise<Genre | null> {
  try {
    const docRef = doc(genresCollection, id).withConverter(genreConverter);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return snapshot.data();
  } catch (error) {
    console.error(`Error fetching genre ${id}:`, error);
    throw error;
  }
}

export async function createGenre(genreData: Omit<Genre, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(genresCollection.withConverter(genreConverter), genreData);
    invalidateGenresCache();
    return docRef.id;
  } catch (error) {
    console.error("Error creating genre:", error);
    throw error;
  }
}

export async function updateGenre(id: string, updates: Partial<Omit<Genre, 'id'>>): Promise<void> {
  try {
    const docRef = doc(genresCollection, id).withConverter(genreConverter);
    await updateDoc(docRef, updates);
    invalidateGenresCache();
  } catch (error) {
    console.error(`Error updating genre ${id}:`, error);
    throw error;
  }
}

export async function deleteGenre(id: string): Promise<void> {
  try {
    const docRef = doc(genresCollection, id).withConverter(genreConverter);
    await deleteDoc(docRef);
    invalidateGenresCache();
  } catch (error) {
    console.error(`Error deleting genre ${id}:`, error);
    throw error;
  }
}

export function invalidateGenresCache(): void {
  genresCache = null;
  cacheTimestamp = null;
}

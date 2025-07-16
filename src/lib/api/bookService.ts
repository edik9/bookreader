import { booksCollection, userBooksCollection} from "../firebase/firebase";
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { getStorage } from 'firebase/storage'
import {addDoc, getDocs} from 'firebase/firestore'
import type {Book} from '../../types/Book'

const storage = getStorage()

export const uploadBook = async (
  bookData: Omit<Book, 'id' | 'createdAt' | 'fileUrl' | 'coverUrl'>,
  files: {
    bookFile: File;
    coverImage?: File;
  },
  userId: string
) => {
  try {
    // Загрузка файла книги
    const bookFileRef = ref(storage, `books/${files.bookFile.name}`);
    await uploadBytes(bookFileRef, files.bookFile);
    const bookFileUrl = await getDownloadURL(bookFileRef);

    // Загрузка обложки (если есть)
    let coverUrl: string | null = null;
    if (files.coverImage) {
      const coverRef = ref(storage, `covers/${files.coverImage.name}`);
      await uploadBytes(coverRef, files.coverImage);
      coverUrl = await getDownloadURL(coverRef);
    }

    // Сохранение метаданных в Firestore
    const bookDoc = {
      ...bookData,
      fileUrl: bookFileUrl,
      coverUrl,
      createdAt: new Date(),
      uploadedBy: userId
    };

    // Добавляем в общую коллекцию и коллекцию пользователя
    const docRef = await addDoc(booksCollection, bookDoc);
    await addDoc(userBooksCollection(userId), {
      bookId: docRef.id,
      addedAt: new Date()
    });

    return { id: docRef.id, ...bookDoc };
  } catch (error) {
    console.error("Error uploading book:", error);
    throw error;
  }
};

export const getUserBooks = async (userId: string): Promise<Array<{ bookId: string }>> => {
  const snapshot = await getDocs(userBooksCollection(userId));
  return snapshot.docs.map(doc => doc.data() as { bookId: string });
};

export const getAllBooks = async (): Promise<Book[]> => {
  const snapshot = await getDocs(booksCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }) as Book);
};
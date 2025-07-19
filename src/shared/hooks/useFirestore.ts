import { useState, useEffect, useCallback } from 'react';
import { 
  DocumentData, 
  QuerySnapshot, 
  DocumentSnapshot,
  Unsubscribe,
  doc
} from 'firebase/firestore';
import { 
  getDocument as getDocService, 
  updateDocument as updateDocService,
  queryCollection as queryCollectionService
} from '../services/firestore.service';
import { FirestoreError } from '@/core/models/sync.model';

/**
 * Хук для работы с Firestore
 * Предоставляет методы для CRUD-операций с подпиской на изменения
 */
export const useFirestore = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | null>(null);

  // Получение документа по ID
  const getDocument = useCallback(
    async <T extends DocumentData>(path: string, id: string): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        return await getDocService<T>(path, id);
      } catch (err) {
        setError(err as FirestoreError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Обновление документа
  const updateDocument = useCallback(
    async (path: string, id: string, data: Partial<DocumentData>): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await updateDocService(path, id, data);
      } catch (err) {
        setError(err as FirestoreError);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Подписка на изменения документа
  const subscribeToDocument = useCallback(
    <T extends DocumentData>(
      path: string,
      id: string,
      callback: (doc: T | null) => void
    ): Unsubscribe => {
      // Реализация с использованием onSnapshot
      // (псевдокод, нужно подключить реальный Firebase)
      const docRef = doc(db, path, id);
      return onSnapshot(docRef, (snap) => {
        callback(snap.exists() ? (snap.data() as T) : null);
      });
    },
    []
  );

  return {
    loading,
    error,
    getDocument,
    updateDocument,
    subscribeToDocument,
    queryCollection: queryCollectionService
  };
};
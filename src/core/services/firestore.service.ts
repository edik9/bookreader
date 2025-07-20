import {
  type DocumentReference,
  type Query,
  type DocumentData,
  type WithFieldValue,
  type CollectionReference,
  type UpdateData,
  type DocumentSnapshot,
  type QuerySnapshot,
  type Unsubscribe,
  QueryConstraint,
  query as firestoreQuery,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import {db} from "./firebase"

export interface FirestoreError extends Error {
  code: string;
  details?: unknown;
}

export async function getDocument<T extends DocumentData>(
  ref: DocumentReference<T>
): Promise<T | null> {
  try {
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? (snapshot.data() as T) : null;
  } catch (error) {
    throw createFirestoreError(error, "getDocument");
  }
}

export async function setDocument<T extends WithFieldValue<DocumentData>>(
  ref: DocumentReference<T>,
  data: T
): Promise<void> {
  try {
    await setDoc(ref, data);
  } catch (error) {
    throw createFirestoreError(error, "setDocument");
  }
}

export async function updateDocument<T extends WithFieldValue<DocumentData>>(
  ref: DocumentReference<T>,
  data: UpdateData<T>
): Promise<void> {
  try {
    await updateDoc(ref, data);
  } catch (error) {
    throw createFirestoreError(error, "updateDocument");
  }
}

export async function deleteDocument(
  ref: DocumentReference
): Promise<void> {
  try {
    await deleteDoc(ref);
  } catch (error) {
    throw createFirestoreError(error, "deleteDocument");
  }
}

export function subscribeToDocument<T extends DocumentData>(
  ref: DocumentReference<T>,
  callback: (data: T | null) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    ref,
    (snapshot: DocumentSnapshot<T>) => {
      callback(snapshot.exists() ? (snapshot.data() as T) : null);
    },
    (error: unknown) => {
      const firestoreError = createFirestoreError(error, "subscribeToDocument");
      onError?.(firestoreError);
    }
  );
}

export function subscribeToQuery<T extends DocumentData>(
  query: Query<T>,
  callback: (data: T[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query,
    (snapshot: QuerySnapshot<T>) => {
      callback(snapshot.docs.map((doc) => doc.data()));
    },
    (error: unknown) => {
      const firestoreError = createFirestoreError(error, "subscribeToQuery");
      onError?.(firestoreError);
    }
  );
}

type BatchOperation =
  | { type: "set"; ref: DocumentReference; data: WithFieldValue<DocumentData> }
  | { type: "update"; ref: DocumentReference; data: UpdateData<DocumentData> }
  | { type: "delete"; ref: DocumentReference };

export async function executeBatch(
  operations: BatchOperation[]
): Promise<void> {
  try {
    const batch = writeBatch(db);
    operations.forEach((op) => {
      switch (op.type) {
        case "set":
          batch.set(op.ref, op.data);
          break;
        case "update":
          batch.update(op.ref, op.data);
          break;
        case "delete":
          batch.delete(op.ref);
          break;
      }
    });
    await batch.commit();
  } catch (error) {
    throw createFirestoreError(error, "executeBatch");
  }
}

export function createQuery<T extends DocumentData>(
  collectionRef: CollectionReference<T>,
  ...queryConstraints: QueryConstraint[]
): Query<T> {
  return firestoreQuery(collectionRef, ...queryConstraints);
}

function createFirestoreError(error: unknown, context: string): FirestoreError {
  console.error(`Firestore error in ${context}:`, error);
  if (typeof error === "object" && error !== null) {
    const firebaseError = error as { code?: string; message?: string };
    return {
      name: "FirestoreError",
      code: firebaseError.code || "unknown",
      message: firebaseError.message || "Unknown Firestore error",
      details: error,
    };
  }
  return {
    name: "FirestoreError",
    code: "unknown",
    message: "Unknown Firestore error",
    details: error,
  };
}

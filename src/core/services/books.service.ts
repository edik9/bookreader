import {
  booksCollection,
  genresCollection,
  getBookRef,
  type Book,
  type Genre,
  type QueryDocumentSnapshot,
} from "./firebase";
import {
  query,
  where,
  orderBy,
  limit as limitFn,
  startAfter,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  QueryConstraint,
} from "firebase/firestore";

export interface PaginatedBooksResult {
  books: Book[]
  lastVisible: QueryDocumentSnapshot<Book> | null
  hasMore: boolean
}

export interface BookQueryOptions {
  genreId?: string
  author?: string
  minRating?: number
  searchTerm?: string
  limit?: number
}

const BOOKS_PAGE_SIZE = 10

export async function getBooksPaginated(
  lastVisible: QueryDocumentSnapshot<Book> | null = null,
  options: BookQueryOptions = {}
): Promise<PaginatedBooksResult> {
  try {
    const queryConstraints: QueryConstraint[] = []
    const { genreId, author, minRating, searchTerm, limit = BOOKS_PAGE_SIZE} = options

    if (genreId) queryConstraints.push(where("genreId", "==", genreId))
    if (author) queryConstraints.push(where("author", "==", author))
    if (minRating) queryConstraints.push(where("rating", ">=", minRating));

    queryConstraints.push(orderBy("publishedAt", "desc"))

    queryConstraints.push(limitFn(limit))
    if (lastVisible) queryConstraints.push(startAfter(lastVisible))

    if (searchTerm) {
      queryConstraints.push(
        where("searchKeywords", "array-contains", searchTerm.toLowerCase())
      )
    }

    const booksQuery = query(booksCollection, ...queryConstraints)
    const snapshot = await getDocs(booksQuery)

    const books = snapshot.docs.map(doc => doc.data())
    const newLastVisible = snapshot.docs[snapshot.docs.length - 1] || null
    const hasMore = snapshot.docs.length === limit

    return {
      books,
      lastVisible: newLastVisible,
      hasMore
    }
  } catch (error) {
    console.error("Error fetching books:", error)
    throw error
  }
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    const snapshot = await getDoc(getBookRef(id))
    return snapshot.exists() ? snapshot.data() : null
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error)
    throw error
  }
}

export async function createBook(bookData: Omit<Book, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(booksCollection, {
      ...bookData,
      searchKeywords: generateSearchKeywords(bookData.title, bookData.author)
    } as Omit<Book, 'id'>)
    return docRef.id
  } catch (error) {
    console.error("Error creating book:", error)
    throw error
  }
}

export async function updateBook(
  id: string,
  updates: Partial<Omit<Book, 'id'>>
): Promise<void> {
  try {
    await updateDoc(getBookRef(id), {
      ...updates,
      ...(updates.title || updates.author ? {
        searchKeywords: generateSearchKeywords(
          updates.title || '',
          updates.author || ''
        )
      }: {})
    })
  } catch (error) {
    console.error(`Error updating book ${id}:`, error)
    throw error
  }
}

export async function deleteBook(id: string): Promise<void> {
  try {
    await deleteDoc(getBookRef(id))
  } catch (error) {
    console.error(`Error deleting book ${id}:`, error)
    throw error
  }
}

export async function getBookGenres(): Promise<Genre[]> {
  try {
    const snapshot = await getDocs(genresCollection)
    return snapshot.docs.map(doc => doc.data())
  } catch (error) {
    console.error("Error fetching genres:", error)
    throw error
  }
}

function generateSearchKeywords(title: string, author: string): string[] {
  const keywords = new Set<string>()

  title.toLowerCase().split(/\s+/).forEach((word: string) => {
    if (word.length > 2) keywords.add(word)
  })

  author.toLowerCase().split(/\s+/).forEach((word: string) => {
    if (word.length > 2) keywords.add(word)
  })

  Array.from(keywords).forEach((keyword: string) => {
    if (keyword.length > 3) {
      keywords.add(keyword.substring(0, keyword.length - 1))
    }
  })
  return Array.from(keywords)
}

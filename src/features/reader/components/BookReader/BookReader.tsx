import React, { useState, useEffect } from 'react'
import { useFirestore } from '@/shared/hooks/useFirestore'
import { ChapterNav } from './ChapterNav'
import styles from './BookReader.module.scss'

interface BookReader {
  bookId: string
}

export const BookReader: React.FC<BookReaderProps> = ({bookId}) => {
  const { getDocument } = useFirestore()
  const [book, setBook] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await getDocument(`library/${bookId}`)
        if (bookData) {
          setBook(bookData)
          const lastPosition = bookData.progress?.lastPosition?.[deviceId]?.percent || 0
          setCurrentPage(Math.floor(lastPosition * bookData.totalPages / 100))
        }
        setIsLoading(false)
      } catch {
        setError('Ошибка загрузки книги')
        setIsLoading(false)
      }
    }
    
    fetchBook()
  }, [bookId, getDocument])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < (book?.totalPages || 0)) {
      setCurrentPage(newPage)
    }
  }

  if (isLoading) return <div className={styles.loader}>Загрузка книги...</div>
  if (error) return <div className={styles.errror}>{error}</div>
  if (!book) return <div className={styles.error}>Книга не найдена</div>

  return (
    <div className={styles.readerContainer}>
      <div className={styles.readerHeader}>
        <h2>{book.title}</h2>
        <p>Автор: {book.author}</p>
      </div>

      <div className={styles.readerContent}>
        <div className={styles.pageContent}>
          <p>Страница {currentPage + 1} из {book.totalPages}</p>
        </div>
      </div>

      <ChapterNav
        currentPage={currentPage}
        totalPages={book.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
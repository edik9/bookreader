import React, { useEffect, useState } from 'react'
import { useFirestore } from '@/shared/hooks/useFirestore'
import { ProgressBar } from '@/shared/components/UI/ProgressBar'
import styles from './ProgressTracker.module.css'

interface ProgressTrackerProps {
  bookId: string
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ bookId }) => {
  const { getDocument, updateDocument } = useFirestore()
  const [progress, setProgress] = useState<number>(0)
  const [readingTime, setReadingTime] = useState<number>(0)
  const [currentChapter, setCurrentChapter] = useState<string>('')
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const bookData = await getDocument('library', bookId)
        if (bookData?.progress) {
          setProgress(bookData.progress.percent || 0)
          setReadingTime(bookData.progress.totalReadingTimeMinutes || 0)
          setCurrentChapter(bookData.progress.currentChapter || 'начало')
        }
      } catch (err) {
        console.error('ошибка загрузки прогресса', err)
      }
    }
    fetchProgress()
  }, [bookId, getDocument])

  const updateProgress = async (newProgress: number) => {
    setIsSyncing(true)
    try {
      await updateDocument('library', bookId, {
        'progress.percent': newProgress,
        'progress.lastRead': new Date(),
        'stats.tatalReadingTimeMinutes': readingTime + 5,
      })
      setProgress(newProgress)
    } catch (err) {
      console.error('ошибка обновления прогресса:', err)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
       <div className={styles.trackerContainer}>
      <h3>Прогресс чтения</h3>
      
      <div className={styles.progressBarWrapper}>
        <ProgressBar value={progress} max={100} />
        <span className={styles.progressText}>{progress}%</span>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Текущая глава:</span>
          <span className={styles.statValue}>{currentChapter}</span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Время чтения:</span>
          <span className={styles.statValue}>{readingTime} мин</span>
        </div>
      </div>

      <div className={styles.controls}>
        <button 
          className={styles.controlButton}
          onClick={() => updateProgress(Math.min(100, progress + 5))}
          disabled={isSyncing}
        >
          +5%
        </button>
        <button 
          className={styles.controlButton}
          onClick={() => updateProgress(Math.max(0, progress - 5))}
          disabled={isSyncing}
        >
          -5%
        </button>
        {isSyncing && <span className={styles.syncStatus}>Синхронизация...</span>}
      </div>
    </div>
  )
}
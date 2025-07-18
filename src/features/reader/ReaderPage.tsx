import { useParams } from "react-router-dom";
import { BookReader } from './components/BookReader'
import { ProgressTracker } from './components/ProgressTracker'

export const ReaderPage = () => {
  const { bookId } = useParams<{bookId: string}>()

  return (
    <div>
      <BookReader bookId={bookId!}/>
      <ProgressTracker bookId={bookId!}/>
    </div>
  )
}
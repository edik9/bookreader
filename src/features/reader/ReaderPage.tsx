import { useParams } from "react-router-dom";

export const ReaderPage = () => {
  const { bookId } = useParams<{bookId: string}>()

  return (
    <div>
      <BookReader bookId={bookId!}/>
      <ProgressTracker bookId={bookId!}/>
    </div>
  )
}
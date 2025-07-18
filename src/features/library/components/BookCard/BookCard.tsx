import { useNavigate } from "react-router-dom";
import type { Book } from 'types/booksType'

export const BookCard = ({ book }: { book: Book }) =>{
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(`/reader/${book.id}`)}>
      <h3>{book.title}</h3>
    </div>
  )
}
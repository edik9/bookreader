import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllBooks, getUserBooks } from "../lib/api/bookService";
import type { Book } from "../types/Book";

export function Library() {
  const { user, isGuest } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let booksData;
        if (user) {
          const userBooks = await getUserBooks(user.uid);
          const allBooks = await getAllBooks();
          booksData = allBooks.filter((book) => userBooks.some((ub) => ub.bookId === book.id));
        } else {
          booksData = await getAllBooks();
        }
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [user]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="library-page">
      <h1>Моя библыотэка!</h1>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            {book.coverUrl && <img src={book.coverUrl} alt={book.title} className="book-cover" />}
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <a
              href={book.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="download-btn"
            >
              Читатьть
            </a>
          </div>
        ))}
      </div>
      <p>
        {user
          ? `добр бобр, ${user?.email}! добавь там ченить из книг себе`
          : isGuest
            ? "Вы в гостевом режиме"
            : "доступ запрещён"}
      </p>
    </div>
  );
}

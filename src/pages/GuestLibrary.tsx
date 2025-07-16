import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export function GuestLibrary(){
  const {isGuest, disableGuestMode} = useAuth()

  const guestBooks = [
    { id: 1, title: "Пример книги 1", author: "Автор 1" },
    { id: 2, title: "Пример книги 2", author: "Автор 2" },
    { id: 3, title: "Пример книги 3", author: "Автор 3" },
  ];
  
  if (!isGuest) {
    return (
      <div className="guest-library">
        <h2>Доступ только для гостей, лошок</h2>
        <Link to="/" className="btn">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="guest-library">
      <h1>Гостевая библиотека</h1>
      <p>Вы просматриваете книги в гостевом режиме</p>
      
      <div className="books-list">
        {guestBooks.map(book => (
          <div key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>
        ))}
      </div>

      <div className="guest-actions">
        <button 
          onClick={disableGuestMode} 
          className="btn exit-guest-btn"
        >
          Выйти из гостевого режима
        </button>
        <Link to="/register" className="btn register-btn">
          Зарегистрироваться для полного доступа
        </Link>
      </div>
    </div>
  );
}
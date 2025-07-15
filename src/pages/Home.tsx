import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <h1>Вот вам книжная читалка, охаё они чан епта</h1>
      <div className="auth-options">
        {user ?(
          <Link to="/library" className="btn">
            Перейти в мою библиотэку найкрайше митцу 
          </Link>
        ) : (
          <>
            <Link to="/auth" className="btn">
              Войти в айти и выйти
            </Link>
            <Link to="/guest-library" className="btn secondary">
              Продолжить как гость
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

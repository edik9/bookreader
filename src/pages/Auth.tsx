import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Слышь, гениус, все поля вабсета заполнить надо");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            setError("Неверный формат email, переделывай");
            break;
          case "auth/user-not-found":
            setError("Пользователь не найден, меняй");
            break;
          case "auth/wrong-password":
            setError("Неверный пароль, ты совсем там шоли?");
            break;
          default:
            setError("Ошибка при входе, удачи войти чел");
            console.error(error);
        }
      } else {
        setError("Неизвестная ошибка. Помянем");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Вход в систему</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading} className={loading ? "loading" : ""}>
          {loading ? "Вход..." : "Войти"}
        </button>
        <div className="auth-links">
          <Link to="/reset-password">Забыли пароль?</Link>
          <Link to="/register">Регистрация</Link>
        </div>
      </form>
    </div>
  );
}

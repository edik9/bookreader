import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../lib/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

export function Register() {
  // Состояния формы
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Состояния UI
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailValid, setEmailValid] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  // Валидация email в реальном времени
  useEffect(() => {
    setEmailValid(/^\S+@\S+\.\S+$/.test(email));
  }, [email]);

  // Анализ сложности пароля
  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  // Обработчик регистрации
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (!name || !email || !password || !confirmPassword) {
      setError("Заполните все поля");
      return;
    }

    if (!emailValid) {
      setError("Введите корректный email");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Создаем пользователя
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Сохраняем дополнительную информацию в Firestore
      await setDoc(doc(db, "users", user.uid), {
        displayName: name,
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      // Отправляем email для подтверждения
      await sendEmailVerification(user);

      // Показываем сообщение об успехе
      setShowSuccess(true);

      // Перенаправляем через 3 секунды
      setTimeout(() => navigate("/library"), 3000);
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            setError("Этот email уже используется");
            break;
          case "auth/invalid-email":
            setError("Неверный формат email");
            break;
          case "auth/weak-password":
            setError("Пароль слишком простой");
            break;
          default:
            setError("Произошла ошибка при регистрации");
            console.error(err);
        }
      } else {
        setError("Неизвестная ошибка");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Функция для определения цвета индикатора сложности пароля
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "red";
      case 1:
        return "orange";
      case 2:
        return "yellow";
      case 3:
        return "lightgreen";
      default:
        return "green";
    }
  };

  return (
    <div className="auth-container">
      <h2>Создать аккаунт</h2>

      {showSuccess ? (
        <div className="success-message">
          <h3>Регистрация успешна!</h3>
          <p>На ваш email отправлено письмо для подтверждения.</p>
          <p>Перенаправляем в библиотеку...</p>
        </div>
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleRegister}>
            {/* Поле для имени */}
            <div className="form-group">
              <label htmlFor="name">Ваше имя:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                placeholder="Как вас зовут?"
              />
            </div>

            {/* Поле для email */}
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="example@mail.com"
                className={email && !emailValid ? "invalid" : ""}
              />
              {email && !emailValid && <span className="input-hint">Введите корректный email</span>}
            </div>

            {/* Поле для пароля */}
            <div className="form-group">
              <label htmlFor="password">Пароль:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Не менее 6 символов"
                minLength={6}
              />
              {password && (
                <div className="password-strength">
                  <span>Сложность пароля:</span>
                  <div
                    className="strength-meter"
                    style={{
                      width: `${passwordStrength * 20}%`,
                      backgroundColor: getPasswordStrengthColor(),
                    }}
                  ></div>
                </div>
              )}
            </div>

            {/* Поле для подтверждения пароля */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль:</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                placeholder="Повторите пароль"
              />
              {password && confirmPassword && password !== confirmPassword && (
                <span className="input-hint">Пароли не совпадают</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !emailValid || password !== confirmPassword}
              className={`btn ${loading ? "loading" : ""}`}
            >
              {loading ? "Регистрируем..." : "Зарегистрироваться"}
            </button>
          </form>

          <div className="auth-links">
            Уже есть аккаунт? <Link to="/auth">Войти</Link>
          </div>
        </>
      )}
    </div>
  );
}

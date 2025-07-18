import { useState } from "react";
import styles from './AuthForm.module.scss'

interface AuthFormProps {
  mode: 'login' | 'register'
}

export const AuthForm = ({mode}: AuthFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`${mode} with:`, {email, password})
    // здесь будет логика аунтификации
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input 
          id="email"
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Пароль:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
      </button>
    </form>
  )
}

import { AuthForm } from './components/AuthForm';
import styles from './RegisterPage.module.scss'; // если есть стили

export const RegisterPage = () => {
  return (
    <div className={styles.page}>
      <AuthForm mode="register" />
    </div>
  );
};
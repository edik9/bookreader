// features/auth/LoginPage.tsx
import AuthForm from './components/AuthForm';
import GuestWarning from './components/GuestWarning';
import styles from './LoginPage.module.scss'; 

export const LoginPage = () => {
  return (
    <div className={styles.page}>
      <AuthForm mode="login" />
      <GuestWarning />
    </div>
  );
};
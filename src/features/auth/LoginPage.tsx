import AuthForm from './components/AuthForm'
import GuestWarning from './components/GuestWarning';

export const LoginPage = () => {
  return (
    <div>
      <AuthForm mode="login"/>
      <GuestWarning />
    </div>
  )
}
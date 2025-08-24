import { Navigate } from 'react-router';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <div>
      Login
      <button
        onClick={() => {
          console.log('clicked');
          login();
        }}
      >
        Login
      </button>
    </div>
  );
}

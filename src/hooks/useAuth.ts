import { useContext } from 'react';
import AuthContext from '../context/auth';

export default function useAuth() {
  const authContext = useContext(AuthContext);
  return authContext;
}

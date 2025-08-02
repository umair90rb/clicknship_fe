import { createContext } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  token: null | string;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  token: null,
  login() {},
  logout() {},
});

export default AuthContext;

import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { AUTH_TOKEN_KEY } from '../constants/keys';

function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  token: null | string;
  login: (token: string) => void;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoadingAuth: true,
  token: null,
  login: (token: string) => {},
  logout: () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<null | string>(null);

  const login = async (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setToken(token);
    setIsAuthenticated(true);
    
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      setToken(token);
      setIsLoadingAuth(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoadingAuth, isAuthenticated, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

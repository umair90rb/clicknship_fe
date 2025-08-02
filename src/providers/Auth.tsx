import { useEffect, useState, type PropsWithChildren } from 'react';
import { AUTH_TOKEN_KEY } from '../constants/keys';
import AuthContext from '../context/auth';

function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export default function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<null | string>(null);

  const login = () => {
    console.log('login');
    localStorage.setItem(AUTH_TOKEN_KEY, 'fake_token');
    setToken('fake_token');
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
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

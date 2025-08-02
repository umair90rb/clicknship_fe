import { type PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import useAuth from '../hooks/useAuth';

interface PrivateRouteProps {
  redirectPath?: string;
}

export default function PrivateRoute({
  children,
  redirectPath = '/login',
}: PropsWithChildren<PrivateRouteProps>) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  return children;
}

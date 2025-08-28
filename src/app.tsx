import PrivateRoute from '@/components/PrivateRoute';
import AuthProvider from '@/context/auth';
import useTenant from '@/hooks/useTenant';
import DashboardLayout from '@/layouts/dashboard';
import { store } from '@/store';
import React, { Suspense, type PropsWithChildren } from 'react'; // Import Suspense from React
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router';

// Use React.lazy() to dynamically import page components.
// The import() function returns a Promise that resolves to the module.
const Login = React.lazy(() => import('@/pages/login'));
const Signup = React.lazy(() => import('@/pages/signup'));
const ResetPassword = React.lazy(() => import('@/pages/reset-password'));
const NotFound = React.lazy(() => import('@/pages/not-found'));

const Dashboard = React.lazy(() => import('@/pages/dashboard'));
const Orders = React.lazy(() => import('@/pages/orders'));
const CreateOrder = React.lazy(() => import('@/pages/orders/create'));
const UpdateOrder = React.lazy(() => import('@/pages/orders/update'));
const ViewOrder = React.lazy(() => import('@/pages/orders/view'));

const TenantGuard = ({ children }: PropsWithChildren) => {
  const tenant = useTenant();

  // If there's no tenant, show the 404/NotFound page.
  if (!tenant) {
    return <NotFound tenant={true} />;
  }

  // If there's a tenant, render the protected content.
  return children;
};

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <TenantGuard>
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  </TenantGuard>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="orders">
                  <Route index element={<Orders />} />
                  <Route path=":orderId" element={<ViewOrder />} />
                  <Route path=":orderId/update" element={<UpdateOrder />} />
                  <Route path="create" element={<CreateOrder />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route
                path="login"
                element={
                  <TenantGuard>
                    <Login />
                  </TenantGuard>
                }
              />
              <Route
                path="reset-password"
                element={
                  <TenantGuard>
                    <ResetPassword />
                  </TenantGuard>
                }
              />

              <Route path="signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

import PrivateRoute from '@/components/PrivateRoute';
import AuthProvider from '@/context/auth';
import useTenant from '@/hooks/useTenant';
import DashboardLayout from '@/layouts/dashboard';
import React, { Suspense } from 'react'; // Import Suspense from React
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

export default function App() {
  const tenant = useTenant();

  if (!tenant) {
    return <NotFound />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />

              <Route path="orders" >
                <Route index element={<Orders />} />
                <Route path=":orderId" element={<ViewOrder />} />
                <Route path=":orderId/update" element={<UpdateOrder />} />
                <Route path="create" element={<CreateOrder />} />
              </Route>
            </Route>

            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

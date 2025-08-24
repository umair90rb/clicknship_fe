import PrivateRoute from '@/components/PrivateRoute';
import AuthProvider from '@/context/auth';
import useTenant from '@/hooks/useTenant';
import DashboardLayout from '@/layouts/dashboard';
import Index from '@/pages';
import Login from '@/pages/login';
import NotFound from '@/pages/not-found';
import Orders from '@/pages/orders';
import CreateOrder from '@/pages/orders/create';
import UpdateOrder from '@/pages/orders/update';
import ViewOrder from '@/pages/orders/view';
import { BrowserRouter, Route, Routes } from 'react-router';

export default function App() {
  const tenant = useTenant();

  if (!tenant) {
    return <NotFound />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          
          <Route path='/' element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            
             <Route index element={<Index />} />

            <Route path="orders" >
              <Route index element={<Orders />} />
              <Route path=":orderId" element={<ViewOrder />} />
              <Route path=":orderId/update" element={<UpdateOrder />} />
              <Route path="create" element={<CreateOrder />} />
            </Route>
          </Route>


          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
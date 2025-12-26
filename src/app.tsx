import PrivateRoute from "@/components/PrivateRoute";
import AuthProvider from "@/context/auth";
import { DrawerProvider } from "@/context/drawer";
import { ThemeProvider } from "@/context/theme";
import useTenant from "@/hooks/useTenant";
import DashboardLayout from "@/layouts/dashboard";
import { store } from "@/store";
import React, { Suspense, type PropsWithChildren } from "react"; // Import Suspense from React
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { ConfirmProvider } from "material-ui-confirm";
import { ConfirmSelectProvider } from "./components/ConfirmSelection";

const Login = React.lazy(() => import("@/pages/login"));
const Signup = React.lazy(() => import("@/pages/signup"));
const ResetPassword = React.lazy(() => import("@/pages/reset-password"));
const NotFound = React.lazy(() => import("@/pages/not-found"));

const Dashboard = React.lazy(() => import("@/pages/dashboard"));
const Reports = React.lazy(() => import("@/pages/reports/"));
const Billing = React.lazy(() => import("@/pages/billing"));

const Orders = React.lazy(() => import("@/pages/orders/index/"));
const OrderCreate = React.lazy(() => import("@/pages/orders/create/"));
const OrderReturn = React.lazy(() => import("@/pages/orders/return/"));
// const CreateOrder = React.lazy(() => import("@/pages/orders/create"));
// const UpdateOrder = React.lazy(() => import("@/pages/orders/update"));

const Products = React.lazy(() => import("@/pages/products"));
const Customers = React.lazy(() => import("@/pages/customers"));

const CourierIntegration = React.lazy(
  () => import("@/pages/courier-integration")
);
const CitiesManagement = React.lazy(() => import("@/pages/cities-management"));

const SalesChannel = React.lazy(() => import("@/pages/sales-channel"));
const CategoryAndBrands = React.lazy(
  () => import("@/pages/categories-and-brands")
);
const StaffAndPermissions = React.lazy(
  () => import("@/pages/staff-and-permissions")
);
const Support = React.lazy(() => import("@/pages/support"));
const Inventory = React.lazy(() => import("@/pages/inventory"));

const TenantGuard = ({ children }: PropsWithChildren) => {
  const tenant = useTenant();

  if (!tenant) {
    return <NotFound tenant={true} />;
  }

  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <ConfirmSelectProvider>
        <ConfirmProvider>
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
                          <DrawerProvider>
                            <DashboardLayout />
                          </DrawerProvider>
                        </PrivateRoute>
                      </TenantGuard>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="reports" element={<Reports />} />

                    <Route path="billing" element={<Billing />} />

                    <Route path="orders">
                      <Route index element={<Orders />} />
                      <Route path="create" element={<OrderCreate />} />
                      <Route path="return" element={<OrderReturn />} />
                      {/* <Route path=":orderId" element={<ViewOrder />} /> */}
                      {/* <Route path=":orderId/update" element={<UpdateOrder />} /> */}
                    </Route>

                    <Route path="products" element={<Products />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="customers" element={<Customers />} />

                    <Route
                      path="courier-integration"
                      element={<CourierIntegration />}
                    />
                    <Route
                      path="cities-management"
                      element={<CitiesManagement />}
                    />

                    <Route path="sales-channel" element={<SalesChannel />} />
                    <Route
                      path="categories-and-brands"
                      element={<CategoryAndBrands />}
                    />
                    <Route
                      path="staff-and-permissions"
                      element={<StaffAndPermissions />}
                    />
                    <Route path="support" element={<Support />} />

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
        </ConfirmProvider>
      </ConfirmSelectProvider>
    </ThemeProvider>
  );
}

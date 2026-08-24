import React from "react";
import { Routes, Route } from "react-router-dom";
import StoreLayout from "./layouts/StoreLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Cards from "./pages/Cards";
import CardDetails from "./pages/CardDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminCards from "./pages/admin/AdminCards";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminUsers from "./pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
const store = (p) => <StoreLayout>{p}</StoreLayout>;
const admin = (p) => (
  <ProtectedRoute role="ADMIN">
    <AdminLayout>{p}</AdminLayout>
  </ProtectedRoute>
);
export default function App() {
  return (
    <Routes>
      <Route path="/" element={store(<Home />)} />
      <Route path="/cards" element={store(<Cards />)} />
      <Route path="/cards/:id" element={store(<CardDetails />)} />
      <Route
        path="/login"
        element={<PublicOnlyRoute>{store(<Login />)}</PublicOnlyRoute>}
      />
      <Route
        path="/register"
        element={<PublicOnlyRoute>{store(<Register />)}</PublicOnlyRoute>}
      />
      <Route
        path="/cart"
        element={store(
          <ProtectedRoute role="USER">
            <Cart />
          </ProtectedRoute>,
        )}
      />
      <Route
        path="/checkout"
        element={store(
          <ProtectedRoute role="USER">
            <Checkout />
          </ProtectedRoute>,
        )}
      />
      <Route
        path="/orders"
        element={store(
          <ProtectedRoute role="USER">
            <Orders />
          </ProtectedRoute>,
        )}
      />
      <Route
        path="/orders/:id"
        element={store(
          <ProtectedRoute role="USER">
            <OrderDetails />
          </ProtectedRoute>,
        )}
      />
      <Route
        path="/profile"
        element={store(
          <ProtectedRoute role="USER">
            <Profile />
          </ProtectedRoute>,
        )}
      />
      <Route path="/admin" element={admin(<AdminOverview />)} />
      <Route path="/admin/cards" element={admin(<AdminCards />)} />
      <Route path="/admin/categories" element={admin(<AdminCategories />)} />
      <Route path="/admin/orders" element={admin(<AdminOrders />)} />
      <Route path="/admin/payments" element={admin(<AdminPayments />)} />
      <Route path="/admin/users" element={admin(<AdminUsers />)} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

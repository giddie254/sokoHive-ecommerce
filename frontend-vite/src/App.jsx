// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public/User Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccess from './pages/OrderSuccess';
import AuthPage from './pages/AuthPage';
import WishlistPage from './pages/WishlistPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import EditProfilePage from './pages/EditProfilePage';
import HelpPage from './pages/HelpPage';
import ShippingPage from './pages/shippingPage';
import ReturnsPage from './pages/ReturnsPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminDashboard from './pages/admin/pages/AdminDashboard';
import ProductsList from './pages/admin/pages/ProductsList';
import CreateProduct from './pages/admin/pages/CreateProduct';
import EditProduct from './pages/admin/pages/EditProduct';
import OrdersList from './pages/admin/pages/OrdersList';
import OrderDetails from './pages/admin/pages/orderDetails';
import UsersList from './pages/admin/pages/UsersList';
import AdminCouponAnalytics from './pages/admin/pages/AdminCouponAnalytics';
import AdminFileManager from './pages/admin/pages/AdminFileManager';
import AdminAlerts from './pages/admin/AdminAlerts';
import AdminRealtimeAnalytics from './pages/admin/pages/AdminRealtimeAnalytics';
import AdminReviews from './pages/admin/pages/AdminReviews';
import AdminInventory from './pages/admin/pages/AdminInventory';
import AdminBanners from './pages/admin/pages/AdminBanners';
import AdminMarketingEmail from './pages/admin/pages/AdminMarketingEmail'; // ✅
import AdminMpesaPayments from "./pages/admin/pages/AdminMpesaPayments";
import AdminSettings from './pages/admin/pages/AdminSettings';
import AdminHomepage from "./pages/admin/pages/AdminHomepage";
import AdminFlashDeals from "./pages/admin/pages/AdminFlashDeals";


// Layouts
import Layout from './components/Layout';
import AdminLayout from './pages/admin/components/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Routes>
      {/* Public/User Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<OrderSuccess />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="products/new" element={<CreateProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="users" element={<UsersList />} />
        <Route path="alerts" element={<AdminAlerts />} />
        <Route path="files" element={<PrivateRoute><AdminFileManager /></PrivateRoute>} />
        <Route path="coupons/analytics" element={<AdminCouponAnalytics />} />
        <Route path="realtime-analytics" element={<AdminRealtimeAnalytics />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="inventory" element={<AdminInventory />} /> {/* ✅ NEW */}
        <Route path="banners" element={<AdminBanners />} />
        <Route path="email-marketing" element={<AdminMarketingEmail />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="/admin/homepage" element={<AdminHomepage />} />
        <Route path="/admin/flash-deals" element={<AdminFlashDeals />} />
        <Route path="/admin/mpesa-payments" element={<AdminMpesaPayments />} />


      </Route>
    </Routes>
  );
};

export default App;


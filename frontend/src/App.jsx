import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Deals from './pages/Deals';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Blogs from './pages/Blogs';
import ReferEarn from './pages/ReferEarn';
import Careers from './pages/Careers';
import OpenRoles from './pages/OpenRoles';
import JobDetail from './pages/JobDetail';
import Culture from './pages/Culture';
import Mission from './pages/Mission';
import ImpactReport from './pages/ImpactReport';
import SocialResponsibility from './pages/SocialResponsibility';
import StoreLocator from './pages/StoreLocator';
import Community from './pages/Community';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import AdminCustomers from './pages/admin/AdminCustomers';
import SalesReport from './pages/admin/SalesReport';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="sales" element={<SalesReport />} />
                  <Route path="reviews" element={<AdminReviews />} />
                </Route>

                {/* Public Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/refer-and-earn" element={<ReferEarn />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/open-roles" element={<OpenRoles />} />
                  <Route path="/job/:id" element={<JobDetail />} />
                  <Route path="/culture" element={<Culture />} />
                  <Route path="/mission" element={<Mission />} />
                  <Route path="/impact-report" element={<ImpactReport />} />
                  <Route path="/social-responsibility" element={<SocialResponsibility />} />
                  <Route path="/store-locator" element={<StoreLocator />} />
                  <Route path="/community" element={<Community />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#333',
                  },
                  success: {
                    iconTheme: {
                      primary: '#2FB973',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
import { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Star, Users, LogOut, TrendingUp, Leaf, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../../components/common/Loading';

const AdminLayout = () => {
  const { user, logout, isAdmin, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return <Loading />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
      allowedRoles: ['super_admin', 'admin', 'admin_products', 'admin_orders', 'admin_customers', 'admin_sales', 'admin_reviews']
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
      allowedRoles: ['super_admin', 'admin', 'admin_products']
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingCart,
      allowedRoles: ['super_admin', 'admin', 'admin_orders']
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: Users,
      allowedRoles: ['super_admin', 'admin', 'admin_customers']
    },
    {
      name: 'Sales Report',
      path: '/admin/sales',
      icon: TrendingUp,
      allowedRoles: ['super_admin', 'admin', 'admin_sales']
    },
    {
      name: 'Reviews',
      path: '/admin/reviews',
      icon: Star,
      allowedRoles: ['super_admin', 'admin', 'admin_reviews']
    },
  ];

  const filteredNavItems = navItems.filter(item =>
    item.allowedRoles.includes(user?.role)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-8 py-8">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-xl shadow-md">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Be-Eco Admin</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 mb-4 px-4 py-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {user?.name?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Admin</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-all font-bold text-sm"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 min-h-screen flex flex-col w-full overflow-x-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 md:px-8 sticky top-0 z-40 justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 mr-4 text-gray-500 hover:bg-gray-50 rounded-lg lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest truncate">
              <span className="hidden sm:inline">Admin</span>
              <span className="mx-2 sm:mx-3 opacity-30 hidden sm:inline">/</span>
              <span className="text-primary truncate max-w-[150px] md:max-w-none">
                {navItems.find(item => window.location.pathname === item.path || (item.path !== '/admin' && window.location.pathname.startsWith(item.path)))?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="lg:hidden flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                {user?.name?.[0]}
              </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

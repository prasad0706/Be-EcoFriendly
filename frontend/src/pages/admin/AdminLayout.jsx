import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Star, Users, LogOut, TrendingUp, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Loading from '../../components/common/Loading';

const AdminLayout = () => {
  const { user, logout, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Sales Report', path: '/admin/sales', icon: TrendingUp },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar with Glassmorphism */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 z-50">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-br from-green-eco to-primary-blue p-2 rounded-xl shadow-lg shadow-green-eco/20">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Be-Eco</h1>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-11">Management Hub</p>
          </div>

          {/* User Profile Quick View */}
          <div className="px-6 mb-8">
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-xl font-bold text-gray-600">
                {user?.name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-green-eco font-semibold uppercase">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110`} />
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-6 py-8">
            <button
              onClick={logout}
              className="flex items-center space-x-3 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 w-full transition-all duration-300 font-bold text-sm border border-transparent hover:border-red-100"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-72 min-h-screen">
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center space-x-4 text-sm font-medium text-gray-500">
            <span>Admin</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-bold capitalize">
              {window.location.pathname.split('/').pop() || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <Star className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        <main className="px-10 py-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

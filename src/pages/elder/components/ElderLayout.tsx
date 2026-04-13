import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { 
  Home, 
  Calendar, 
  Phone, 
  ShoppingBag, 
  Heart, 
  Shield, 
  Car, 
  User, 
  Bell,
  Menu,
  X
} from 'lucide-react';

interface ElderLayoutProps {
  children?: React.ReactNode;
}

const ElderLayout: React.FC<ElderLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'elder')) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const menuItems = [
    { path: '/elder', icon: Home, label: 'Dashboard' },
    { path: '/elder/profile', icon: User, label: 'Profile' },
    { path: '/elder/bookings', icon: Calendar, label: 'My Bookings' },
    { path: '/elder/medicines', icon: Heart, label: 'Medicines' },
    { path: '/elder/groceries', icon: ShoppingBag, label: 'Groceries' },
    { path: '/elder/transport', icon: Car, label: 'Transport' },
    { path: '/elder/safety', icon: Shield, label: 'Safety' },
    { path: '/elder/support', icon: Phone, label: 'Support' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/elder' && location.pathname.startsWith(path));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'elder') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">ElderEase</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path) 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-100'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-800">Elder User</p>
              <p className="text-sm text-slate-500">Premium Plan</p>
            </div>
            <Bell className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Bell className="w-5 h-5 text-slate-400" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ElderLayout;

import { Outlet } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useUser();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const studentLinks = [
    { path: '/dashboard/student', label: 'Overview' },
    { path: '/dashboard/student/orders', label: 'My Orders' },
    { path: '/dashboard/student/menu', label: 'Menu' },
    { path: '/dashboard/student/profile', label: 'Profile' },
  ];

  const staffLinks = [
    { path: '/dashboard/staff', label: 'Overview' },
    { path: '/dashboard/staff/orders', label: 'Stall Orders' },
    { path: '/dashboard/staff/profile', label: 'Profile' },
  ];

  const links = user?.role === 'student' ? studentLinks : staffLinks;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-indigo-600">
                  BUFC
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(link.path)
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout; 
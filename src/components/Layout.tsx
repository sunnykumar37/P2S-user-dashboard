import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const sidebarItems = [
    { icon: '◻', label: 'Dashboard', path: '/dashboard', description: 'Overview of all activities' },
    { icon: '🎁', label: 'Donations', path: '/donations', description: 'Manage food donations' },
    { icon: '🍽️', label: 'Food Inventory', path: '/food-inventory', description: 'View and manage food items' },
    { icon: '👥', label: 'NGO Partners', path: '/ngo-partners', description: 'Manage NGO partnerships' },
    { icon: '💬', label: 'Communication', path: '/communication', description: 'Messages and notifications' },
    { icon: '📊', label: 'Reports', path: '/reports', description: 'View reports and analytics' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-white flex-shrink-0 border-r border-gray-200">
        <div className="p-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">User Dashboard</h1>
        </div>
        <div className="p-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-3 hover:bg-gray-100 rounded cursor-pointer mb-2 ${
                location.pathname === item.path ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">{item.icon}</span>
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-4 bg-white flex items-center border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {sidebarItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
        </div>

        {/* Page content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout; 
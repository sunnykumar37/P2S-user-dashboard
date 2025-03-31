import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/donations', label: 'Donations', icon: '🎁' },
    { path: '/inventory', label: 'Food Inventory', icon: '🍽️' },
    { path: '/partners', label: 'Partner Organizations', icon: '🤝' },
    { path: '/communication', label: 'Communication', icon: '💬' },
    { path: '/reports', label: 'Reports', icon: '📈' },
  ];

  const handleSignOut = () => {
    // Add your sign out logic here
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`w-64 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="p-4">
        <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          USER DASHBOARD
        </h1>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 transition-colors
              ${location.pathname === item.path 
                ? `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-600'} border-r-4 border-blue-600`
                : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                User
              </p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
        <button
          onClick={handleSignOut}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors
            ${isDarkMode 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 
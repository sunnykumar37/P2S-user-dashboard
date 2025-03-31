import React, { useState } from 'react';
import { BarChart, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Cell, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
  const [activeView, setActiveView] = useState('bar');
  
  // Sample data - replace with your actual user data
  const monthlyData = [
    { name: 'Jan', revenue: 45000, orders: 52 },
    { name: 'Feb', revenue: 52000, orders: 65 },
    { name: 'Mar', revenue: 47000, orders: 58 },
    { name: 'Apr', revenue: 58000, orders: 70 },
    { name: 'May', revenue: 62000, orders: 80 },
    { name: 'Jun', revenue: 55000, orders: 62 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 65, color: '#1e88e5' },
    { name: 'In Progress', value: 20, color: '#26a69a' },
    { name: 'Pending', value: 15, color: '#ffb74d' },
  ];

  const popularItems = [
    { name: 'Item 1', value: 450 },
    { name: 'Item 2', value: 350 },
    { name: 'Item 3', value: 300 },
    { name: 'Item 4', value: 250 },
    { name: 'Item 5', value: 200 },
  ];

  const sidebarItems = [
    { icon: '◻', label: 'Dashboard', description: 'Overview of all activities' },
    { icon: '🎁', label: 'Donations', description: 'Manage food donations' },
    { icon: '🍽️', label: 'Food Inventory', description: 'View and manage food items' },
    { icon: '👥', label: 'NGO Partners', description: 'Manage NGO partnerships' },
    { icon: '💬', label: 'Communication', description: 'Messages and notifications' },
    { icon: '📊', label: 'Reports', description: 'View reports and analytics' },
  ];

  const handlePrevView = () => {
    setActiveView(activeView === 'bar' ? 'line' : 'bar');
  };

  const handleNextView = () => {
    setActiveView(activeView === 'bar' ? 'line' : 'bar');
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-white flex-shrink-0 border-r border-gray-200">
        <div className="p-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">User Dashboard</h1>
        </div>
        <div className="p-2">
          {sidebarItems.map((item, index) => (
            <div key={index} className="p-3 hover:bg-gray-100 rounded cursor-pointer mb-2">
              <div className="flex items-center">
                <span className="text-xl mr-3">{item.icon}</span>
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-4 bg-white flex items-center border-b border-gray-200">
          <button className="mr-4 text-gray-600">
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>

        {/* Dashboard content */}
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Monthly Revenue & Orders */}
            <div className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Monthly Revenue & Orders</h3>
                <div>
                  <button className="px-2 text-gray-600" onClick={handlePrevView}>←</button>
                  <span className="mx-2">Bar</span>
                  <button className="px-2 text-gray-600" onClick={handleNextView}>→</button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#8dd1e1" />
                    <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#c39bd3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Order Status Distribution</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Popular Menu Items */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Popular Menu Items</h3>
              <div>
                <button className="px-2 text-gray-600">←</button>
                <span className="mx-2">Bar</span>
                <button className="px-2 text-gray-600">→</button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularItems} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8dd1e1" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

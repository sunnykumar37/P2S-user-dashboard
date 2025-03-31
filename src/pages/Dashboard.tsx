import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { isDarkMode } = useTheme();

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Donations',
        data: [120, 150, 180, 160, 200, 170],
        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.8)',
        borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Distributions',
        data: [110, 140, 170, 155, 190, 175],
        backgroundColor: isDarkMode ? 'rgba(147, 51, 234, 0.5)' : 'rgba(147, 51, 234, 0.8)',
        borderColor: isDarkMode ? 'rgba(147, 51, 234, 0.8)' : 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Distributed', 'In Storage', 'Processing'],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: [
          isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.8)',
          isDarkMode ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.8)',
          isDarkMode ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          isDarkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 1)',
          isDarkMode ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 1)',
          isDarkMode ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDarkMode ? '#fff' : '#000',
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
        },
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDarkMode ? '#fff' : '#000',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-2">Welcome back, User!</h1>
      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-8`}>
        Here's what's happening with your organization today.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Today's Donations</h3>
          <p className="text-4xl font-bold text-blue-500">25</p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Items Distributed</h3>
          <p className="text-4xl font-bold text-green-500">180</p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Active Partners</h3>
          <p className="text-4xl font-bold text-purple-500">12</p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Low Stock Items</h3>
          <p className="text-4xl font-bold text-red-500">5</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-4">Monthly Donations & Distributions</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-4">Donation Status Distribution</h3>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      {/* Review System */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
        <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-2">
              <div className="flex-1">
                <h4 className="font-semibold">John Doe</h4>
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                  <span className="text-gray-400 ml-2">5.0</span>
                </div>
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>2 days ago</span>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Excellent service! The team was very helpful and efficient in processing my donation.
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-2">
              <div className="flex-1">
                <h4 className="font-semibold">Jane Smith</h4>
                <div className="flex text-yellow-400">
                  {'★'.repeat(4)}
                  <span className="text-gray-400 ml-2">4.0</span>
                </div>
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>5 days ago</span>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Great experience overall. Would recommend to others looking to make a difference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
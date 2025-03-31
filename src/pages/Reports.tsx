import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import Modal from '../components/Modal';

interface ReportData {
  id: string;
  title: string;
  type: 'Donations' | 'Inventory' | 'Partners' | 'Distribution';
  date: string;
  status: 'Generated' | 'Processing' | 'Failed';
  downloadUrl?: string;
}

const Reports = () => {
  const { isDarkMode } = useTheme();
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: '1',
      title: 'Monthly Donations Report',
      type: 'Donations',
      date: '2024-03-31',
      status: 'Generated',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Inventory Status Report',
      type: 'Inventory',
      date: '2024-03-30',
      status: 'Generated',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'Partner Performance Report',
      type: 'Partners',
      date: '2024-03-29',
      status: 'Processing'
    },
    {
      id: '4',
      title: 'Distribution Analysis',
      type: 'Distribution',
      date: '2024-03-28',
      status: 'Failed'
    }
  ]);

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    title: '',
    type: 'Donations' as 'Donations' | 'Inventory' | 'Partners' | 'Distribution',
    dateRange: 'monthly'
  });

  // Sample data for charts
  const monthlyDonationsData = [
    { month: 'Jan', donations: 120, value: 15000 },
    { month: 'Feb', donations: 150, value: 18000 },
    { month: 'Mar', donations: 180, value: 22000 },
    { month: 'Apr', donations: 160, value: 19000 },
    { month: 'May', donations: 200, value: 25000 },
    { month: 'Jun', donations: 170, value: 21000 }
  ];

  const categoryDistributionData = [
    { name: 'Food Items', value: 45 },
    { name: 'Clothing', value: 25 },
    { name: 'Medical Supplies', value: 15 },
    { name: 'Other', value: 15 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReportFormData({
      ...reportFormData,
      [name]: value
    });
  };

  const handleGenerateReport = () => {
    const newReport: ReportData = {
      id: Date.now().toString(),
      title: reportFormData.title,
      type: reportFormData.type,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing'
    };
    
    setReports([newReport, ...reports]);
    setIsGenerateModalOpen(false);
    setReportFormData({
      title: '',
      type: 'Donations',
      dateRange: 'monthly'
    });
    
    // Simulate processing completed after 3 seconds
    setTimeout(() => {
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === newReport.id 
            ? { ...report, status: 'Generated', downloadUrl: '#' } 
            : report
        )
      );
    }, 3000);
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(report => report.id !== id));
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => setIsGenerateModalOpen(true)}
        >
          Generate New Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
          <p className="text-4xl font-bold text-blue-500">1,020</p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Total Value</h3>
          <p className="text-4xl font-bold text-green-500">$120,000</p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Active Partners</h3>
          <p className="text-4xl font-bold text-purple-500">25</p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Items Distributed</h3>
          <p className="text-4xl font-bold text-orange-500">850</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Donations Chart */}
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-4">Monthly Donations Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDonationsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#ccc'} />
                <XAxis dataKey="month" stroke={isDarkMode ? '#fff' : '#666'} />
                <YAxis yAxisId="left" orientation="left" stroke={isDarkMode ? '#fff' : '#666'} />
                <YAxis yAxisId="right" orientation="right" stroke={isDarkMode ? '#fff' : '#666'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                    color: isDarkMode ? '#fff' : '#333',
                    border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`
                  }}
                />
                <Legend wrapperStyle={{ color: isDarkMode ? '#fff' : '#333' }} />
                <Bar yAxisId="left" dataKey="donations" name="Number of Donations" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="value" name="Value ($)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-4">Donation Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                    color: isDarkMode ? '#fff' : '#333',
                    border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`
                  }}
                />
                <Legend wrapperStyle={{ color: isDarkMode ? '#fff' : '#333' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Report</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">{report.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{report.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{report.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.status === 'Generated' ? 'bg-green-100 text-green-800' :
                    report.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {report.downloadUrl && (
                    <button 
                      className="text-blue-500 hover:text-blue-700 mr-4"
                      onClick={() => console.log('Downloading report:', report.title)}
                    >
                      Download
                    </button>
                  )}
                  <button 
                    className="text-green-500 hover:text-green-700 mr-4"
                    onClick={() => console.log('Viewing report:', report.title)}
                  >
                    View
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generate Report Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate New Report"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Report Title</label>
            <input
              type="text"
              name="title"
              value={reportFormData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="Enter report title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <select
              name="type"
              value={reportFormData.type}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="Donations">Donations</option>
              <option value="Inventory">Inventory</option>
              <option value="Partners">Partners</option>
              <option value="Distribution">Distribution</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <select
              name="dateRange"
              value={reportFormData.dateRange}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsGenerateModalOpen(false)}
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={!reportFormData.title}
          >
            Generate Report
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Reports; 
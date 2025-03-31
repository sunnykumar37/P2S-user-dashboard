import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Modal from '../components/Modal';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  date: string;
  status: 'Unread' | 'Read' | 'Archived';
  priority: 'High' | 'Medium' | 'Low';
}

interface Notification {
  id: string;
  type: 'Donation' | 'Partner' | 'Inventory' | 'System';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const Communication = () => {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Sarah Johnson',
      recipient: 'You',
      subject: 'New Donation Available',
      content: 'We have a large donation of fresh vegetables available for pickup.',
      date: '2024-03-31 10:30 AM',
      status: 'Unread',
      priority: 'High'
    },
    {
      id: '2',
      sender: 'You',
      recipient: 'Michael Chen',
      subject: 'Partnership Agreement',
      content: 'Thank you for your interest in partnering with us. Please review the attached agreement.',
      date: '2024-03-30 2:45 PM',
      status: 'Read',
      priority: 'Medium'
    },
    {
      id: '3',
      sender: 'System',
      recipient: 'You',
      subject: 'Inventory Alert',
      content: 'Low stock alert for canned goods.',
      date: '2024-03-29 9:15 AM',
      status: 'Read',
      priority: 'High'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'Donation',
      title: 'New Donation Received',
      message: 'Food for All Foundation has made a new donation of 100kg rice.',
      date: '2024-03-31 11:00 AM',
      read: false
    },
    {
      id: '2',
      type: 'Partner',
      title: 'New Partner Registration',
      message: 'Global Hunger Relief has registered as a new partner.',
      date: '2024-03-30 3:30 PM',
      read: true
    },
    {
      id: '3',
      type: 'Inventory',
      title: 'Low Stock Alert',
      message: 'Canned beans are running low on stock.',
      date: '2024-03-29 10:00 AM',
      read: true
    }
  ]);

  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState<boolean>(false);
  const [composeData, setComposeData] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setComposeData({
      ...composeData,
      [name]: value
    });
  };

  const handleSendMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      recipient: composeData.recipient,
      subject: composeData.subject,
      content: composeData.content,
      date: new Date().toLocaleString(),
      status: 'Read',
      priority: composeData.priority
    };
    setMessages([newMessage, ...messages]);
    setIsComposeModalOpen(false);
    setComposeData({
      recipient: '',
      subject: '',
      content: '',
      priority: 'Medium'
    });
  };

  const markAsRead = (id: string) => {
    setMessages(
      messages.map(message =>
        message.id === id ? { ...message, status: 'Read' } : message
      )
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const filteredMessages = messages.filter(message => {
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority;
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Communication</h1>
        <button
          onClick={() => setIsComposeModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Compose Message
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Total Messages</h3>
          <p className="text-4xl font-bold text-blue-500">{messages.length}</p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Unread Messages</h3>
          <p className="text-4xl font-bold text-red-500">
            {messages.filter(msg => msg.status === 'Unread').length}
          </p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">High Priority</h3>
          <p className="text-4xl font-bold text-yellow-500">
            {messages.filter(msg => msg.priority === 'High').length}
          </p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <p className="text-4xl font-bold text-purple-500">
            {notifications.filter(n => !n.read).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg mb-8`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
            >
              <option value="all">All Status</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('messages')}
              className={`${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Notifications {unreadNotifications > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Messages List */}
      {activeTab === 'messages' && (
        <div className={`rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg overflow-hidden`}>
          <table className="w-full">
            <thead>
              <tr className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">From/To</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {message.status === 'Unread' ? <span className="font-bold">{message.subject}</span> : message.subject}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {message.content.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{message.sender}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      to {message.recipient}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {message.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      message.status === 'Unread'
                        ? 'bg-yellow-100 text-yellow-800'
                        : message.status === 'Read'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      message.priority === 'High'
                        ? 'bg-red-100 text-red-800'
                        : message.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {message.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {message.status === 'Unread' && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => console.log('View message:', message)}
                      className="text-green-500 hover:text-green-700 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setMessages(messages.filter(m => m.id !== message.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notifications List */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-lg ${
                !notification.read ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full mr-2 ${
                      notification.type === 'Donation' ? 'bg-green-100 text-green-800' :
                      notification.type === 'Partner' ? 'bg-blue-100 text-blue-800' :
                      notification.type === 'Inventory' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {notification.type}
                    </span>
                    <h3 className="text-lg font-semibold">{notification.title}</h3>
                  </div>
                  <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {notification.message}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                    {notification.date}
                  </span>
                  {!notification.read && (
                    <button
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compose Modal */}
      <Modal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        title="Compose Message"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <input
              type="text"
              name="recipient"
              value={composeData.recipient}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              placeholder="Recipient name or email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={composeData.subject}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              placeholder="Message subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              name="content"
              value={composeData.content}
              onChange={handleInputChange}
              rows={5}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              placeholder="Write your message here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              name="priority"
              value={composeData.priority}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsComposeModalOpen(false)}
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send Message
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Communication; 
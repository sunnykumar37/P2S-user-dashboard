import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Modal from '../components/Modal';

interface NGOPartner {
  id: string;
  name: string;
  type: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  status: 'Active' | 'Inactive' | 'Pending';
  partnershipDate: string;
  lastInteraction: string;
  totalDonations: number;
  logo?: string;
}

const NGOPartners = () => {
  const { isDarkMode } = useTheme();
  const [partners, setPartners] = useState<NGOPartner[]>([
    {
      id: '1',
      name: 'Food for All Foundation',
      type: 'Food Bank',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@foodforall.org',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      status: 'Active',
      partnershipDate: '2023-01-15',
      lastInteraction: '2024-03-28',
      totalDonations: 1500
    },
    {
      id: '2',
      name: 'Community Care Initiative',
      type: 'Local NGO',
      contactPerson: 'Michael Chen',
      email: 'michael@communitycare.org',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      status: 'Active',
      partnershipDate: '2023-06-20',
      lastInteraction: '2024-03-25',
      totalDonations: 800
    },
    {
      id: '3',
      name: 'Global Hunger Relief',
      type: 'International NGO',
      contactPerson: 'Emma Wilson',
      email: 'emma@globalhunger.org',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
      status: 'Pending',
      partnershipDate: '2024-02-10',
      lastInteraction: '2024-03-20',
      totalDonations: 0
    }
  ]);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingPartner, setEditingPartner] = useState<NGOPartner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Pending'
  });

  const filteredPartners = partners.filter(partner => {
    const matchesType = filterType === 'all' || partner.type === filterType;
    const matchesStatus = filterStatus === 'all' || partner.status === filterStatus;
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          partner.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          partner.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const types = Array.from(new Set(partners.map(partner => partner.type)));

  const handleEdit = (partner: NGOPartner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      type: partner.type,
      contactPerson: partner.contactPerson,
      email: partner.email,
      phone: partner.phone,
      location: partner.location,
      status: partner.status
    });
    setIsAddModalOpen(true);
  };

  const handleViewDetails = (partner: NGOPartner) => {
    // Implementation for viewing details
    console.log('Viewing details for', partner.name);
  };

  const handleRemove = (partner: NGOPartner) => {
    // Implementation for removing a partner
    setPartners(partners.filter(p => p.id !== partner.id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (editingPartner) {
      // Update existing partner
      const updatedPartners = partners.map(partner => 
        partner.id === editingPartner.id 
          ? { ...partner, ...formData } 
          : partner
      );
      setPartners(updatedPartners);
    } else {
      // Add new partner
      const newPartner: NGOPartner = {
        id: Date.now().toString(),
        partnershipDate: new Date().toISOString().split('T')[0],
        lastInteraction: new Date().toISOString().split('T')[0],
        totalDonations: 0,
        ...formData
      };
      setPartners([...partners, newPartner]);
    }
    setIsAddModalOpen(false);
    setEditingPartner(null);
    setFormData({
      name: '',
      type: '',
      contactPerson: '',
      email: '',
      phone: '',
      location: '',
      status: 'Active'
    });
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Partner Organizations</h1>
        <button
          onClick={() => {
            setEditingPartner(null);
            setFormData({
              name: '',
              type: '',
              contactPerson: '',
              email: '',
              phone: '',
              location: '',
              status: 'Active'
            });
            setIsAddModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Partner
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Total Partners</h3>
          <p className="text-4xl font-bold text-blue-500">{partners.length}</p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Active Partners</h3>
          <p className="text-4xl font-bold text-green-500">
            {partners.filter(partner => partner.status === 'Active').length}
          </p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
          <p className="text-4xl font-bold text-purple-500">
            ${partners.reduce((sum, partner) => sum + partner.totalDonations, 0).toLocaleString()}
          </p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Partner Types</h3>
          <p className="text-4xl font-bold text-yellow-500">
            {new Set(partners.map(partner => partner.type)).size}
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
              placeholder="Search partners..."
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Partners Table */}
      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Partner</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Donations</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPartners.map((partner) => (
              <tr key={partner.id} className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={partner.logo || `https://ui-avatars.com/api/?name=${partner.name}&background=random`}
                        alt={partner.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{partner.name}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        ID: {partner.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {partner.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{partner.contactPerson}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {partner.email}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {partner.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{partner.location}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Last: {partner.lastInteraction}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    partner.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : partner.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {partner.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold">${partner.totalDonations.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(partner)}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewDetails(partner)}
                    className="text-green-500 hover:text-green-700 mr-4"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleRemove(partner)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingPartner ? 'Edit Partner' : 'Add New Partner'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="Partner name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="E.g. Food Bank, NGO, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="Contact name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="contact@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="City, State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {editingPartner ? 'Update Partner' : 'Add Partner'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default NGOPartners; 
import React, { useState } from 'react';
import Modal from '../components/Modal';
import { useTheme } from '../context/ThemeContext';

interface Donation {
  id: string;
  donor: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  type: 'Food' | 'Money' | 'Clothing' | 'Other';
}

const Donations = () => {
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: '1',
      donor: 'Food Bank',
      amount: 1000,
      date: '2024-03-31',
      status: 'Completed',
      type: 'Food'
    },
    {
      id: '2',
      donor: 'Local Restaurant',
      amount: 500,
      date: '2024-03-30',
      status: 'Pending',
      type: 'Food'
    },
    {
      id: '3',
      donor: 'Individual',
      amount: 200,
      date: '2024-03-29',
      status: 'Failed',
      type: 'Money'
    }
  ]);

  const [newDonation, setNewDonation] = useState<Partial<Donation>>({
    donor: '',
    amount: 0,
    type: 'Food',
    status: 'Pending'
  });
  
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);

  const handleAddDonation = () => {
    if (editingDonation) {
      // Update existing donation
      const updatedDonations = donations.map(donation => 
        donation.id === editingDonation.id 
          ? { ...donation, ...newDonation } 
          : donation
      );
      setDonations(updatedDonations);
    } else {
      // Add new donation
      const donation: Donation = {
        ...newDonation,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      } as Donation;

      setDonations([donation, ...donations]);
    }
    
    setIsModalOpen(false);
    setEditingDonation(null);
    resetForm();
  };
  
  const handleEditDonation = (donation: Donation) => {
    setEditingDonation(donation);
    setNewDonation({
      donor: donation.donor,
      amount: donation.amount,
      type: donation.type,
      status: donation.status
    });
    setIsModalOpen(true);
  };
  
  const handleDeleteDonation = (id: string) => {
    setDonations(donations.filter(donation => donation.id !== id));
  };
  
  const resetForm = () => {
    setNewDonation({
      donor: '',
      amount: 0,
      type: 'Food',
      status: 'Pending'
    });
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Donations</h1>
        <button
          onClick={() => {
            setEditingDonation(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Donation
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
          <p className="text-4xl font-bold text-blue-500">{donations.length}</p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Total Amount</h3>
          <p className="text-4xl font-bold text-green-500">
            ${donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Pending Donations</h3>
          <p className="text-4xl font-bold text-yellow-500">
            {donations.filter(d => d.status === 'Pending').length}
          </p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Completed</h3>
          <p className="text-4xl font-bold text-green-500">
            {donations.filter(d => d.status === 'Completed').length}
          </p>
        </div>
      </div>

      {/* Donations Table */}
      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Donor</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {donations.map((donation) => (
              <tr key={donation.id} className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{donation.donor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">${donation.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{donation.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    donation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {donation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    donation.type === 'Food' ? 'bg-blue-100 text-blue-800' :
                    donation.type === 'Money' ? 'bg-green-100 text-green-800' :
                    donation.type === 'Clothing' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {donation.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-500 hover:text-blue-700 mr-4"
                    onClick={() => handleEditDonation(donation)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteDonation(donation.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Donation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDonation ? "Edit Donation" : "Add New Donation"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Donor Name</label>
            <input
              type="text"
              value={newDonation.donor}
              onChange={(e) => setNewDonation({ ...newDonation, donor: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              placeholder="Enter donor name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={newDonation.amount}
              onChange={(e) => setNewDonation({ ...newDonation, amount: Number(e.target.value) })}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={newDonation.type}
              onChange={(e) => setNewDonation({ ...newDonation, type: e.target.value as Donation['type'] })}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
            >
              <option value="Food">Food</option>
              <option value="Money">Money</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={newDonation.status}
              onChange={(e) => setNewDonation({ ...newDonation, status: e.target.value as Donation['status'] })}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDonation}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={!newDonation.donor || !newDonation.amount}
            >
              {editingDonation ? 'Update Donation' : 'Add Donation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Donations; 
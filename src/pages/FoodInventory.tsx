import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Modal from '../components/Modal';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  expiryDate: string;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image?: string;
  sku?: string;
}

const FoodInventory = () => {
  const { isDarkMode } = useTheme();
  const [inventory, setInventory] = useState<FoodItem[]>([
    {
      id: '1',
      name: 'Rice',
      category: 'Grains',
      quantity: 100,
      unit: 'kg',
      minStock: 20,
      expiryDate: '2024-12-31',
      location: 'Storage A',
      status: 'In Stock',
      sku: 'GR-RICE-001',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: '2',
      name: 'Canned Beans',
      category: 'Canned Goods',
      quantity: 15,
      unit: 'cans',
      minStock: 30,
      expiryDate: '2025-06-30',
      location: 'Storage B',
      status: 'Low Stock',
      sku: 'CG-BEAN-002',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: '3',
      name: 'Pasta',
      category: 'Grains',
      quantity: 0,
      unit: 'kg',
      minStock: 10,
      expiryDate: '2025-01-15',
      location: 'Storage A',
      status: 'Out of Stock',
      sku: 'GR-PASTA-003',
      image: 'https://via.placeholder.com/150'
    }
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState<Omit<FoodItem, 'id'>>({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    minStock: 0,
    expiryDate: '',
    location: '',
    status: 'In Stock',
    sku: '',
    image: 'https://via.placeholder.com/150'
  });

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const categories = Array.from(new Set(inventory.map(item => item.category)));

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minStock: item.minStock,
      expiryDate: item.expiryDate,
      location: item.location,
      status: item.status,
      sku: item.sku || '',
      image: item.image || 'https://via.placeholder.com/150'
    });
    setIsAddModalOpen(true);
  };

  const handleAddStock = (item: FoodItem) => {
    // Implementation for adding stock
    const updatedInventory = inventory.map(i => {
      if (i.id === item.id) {
        const newQuantity = i.quantity + 10;
        const newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = newQuantity > i.minStock ? 'In Stock' : 'Low Stock';
        return { ...i, quantity: newQuantity, status: newStatus };
      }
      return i;
    });
    setInventory(updatedInventory);
  };

  const handleRemove = (item: FoodItem) => {
    // Implementation for removing an item
    setInventory(inventory.filter(i => i.id !== item.id));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSubmit = () => {
    if (editingItem) {
      // Update existing item
      const updatedInventory = inventory.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData } 
          : item
      );
      setInventory(updatedInventory);
    } else {
      // Add new item
      const newItem: FoodItem = {
        id: Date.now().toString(),
        ...formData,
        status: formData.quantity === 0 
          ? 'Out of Stock' 
          : formData.quantity < formData.minStock 
            ? 'Low Stock' 
            : 'In Stock'
      };
      setInventory([...inventory, newItem]);
    }
    setIsAddModalOpen(false);
    setEditingItem(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      minStock: 0,
      expiryDate: '',
      location: '',
      status: 'In Stock',
      sku: '',
      image: 'https://via.placeholder.com/150'
    });
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Food Inventory</h1>
        <button
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Item
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Total Items</h3>
          <p className="text-4xl font-bold text-blue-500">{inventory.length}</p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Low Stock Items</h3>
          <p className="text-4xl font-bold text-red-500">
            {inventory.filter(item => item.status === 'Low Stock').length}
          </p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Out of Stock</h3>
          <p className="text-4xl font-bold text-red-500">
            {inventory.filter(item => item.status === 'Out of Stock').length}
          </p>
        </div>
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <p className="text-4xl font-bold text-green-500">{categories.length}</p>
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
              placeholder="Search items..."
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
            >
              <option value="all">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInventory.map((item) => (
              <tr key={item.id} className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        SKU: {item.sku}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    {item.quantity} {item.unit}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Min: {item.minStock} {item.unit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.expiryDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'In Stock'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'Low Stock'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleAddStock(item)}
                    className="text-green-500 hover:text-green-700 mr-4"
                  >
                    Add Stock
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
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
        title={editingItem ? 'Edit Item' : 'Add New Item'}
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
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              placeholder="Item name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              placeholder="Category"
              list="categories"
            />
            <datalist id="categories">
              {categories.map(category => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              placeholder="e.g., kg, pcs, cans"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Stock</label>
            <input
              type="number"
              name="minStock"
              value={formData.minStock}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
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
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              placeholder="Storage location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
              }`}
              style={{ color: isDarkMode ? 'white' : 'black' }}
              placeholder="Stock Keeping Unit"
            />
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
            disabled={!formData.name || !formData.category}
          >
            {editingItem ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FoodInventory; 
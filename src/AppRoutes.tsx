import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import FoodInventory from './pages/FoodInventory';
import NGOPartners from './pages/NGOPartners';
import Communication from './pages/Communication';
import Reports from './pages/Reports';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/donations" element={<Donations />} />
      <Route path="/inventory" element={<FoodInventory />} />
      <Route path="/partners" element={<NGOPartners />} />
      <Route path="/communication" element={<Communication />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
};

export default AppRoutes; 
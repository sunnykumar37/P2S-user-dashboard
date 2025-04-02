import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import FoodInventory from './pages/FoodInventory';
import NGOPartners from './pages/NGOPartners';
import Communication from './pages/Communication';
import Reports from './pages/Reports';
import Map from './components/Map';

const MapPage = () => {
  const googleMapsApiKey = 'AIzaSyCP7fUHlKJ3_sWt7jw2gVg0ZeRIYIIpMio';
  return (
    <div className="p-6">
      <Map apiKey={googleMapsApiKey} />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/donations" element={<Layout><Donations /></Layout>} />
      <Route path="/food-inventory" element={<Layout><FoodInventory /></Layout>} />
      <Route path="/ngo-partners" element={<Layout><NGOPartners /></Layout>} />
      <Route path="/communication" element={<Layout><Communication /></Layout>} />
      <Route path="/reports" element={<Layout><Reports /></Layout>} />
      <Route path="/map" element={<Layout><MapPage /></Layout>} />
    </Routes>
  );
};

export default AppRoutes; 
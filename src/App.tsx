import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';

import ElderHome from './pages/elder/ElderHome';
import ProfilePage from './pages/elder/ProfilePage';
import Bookings from './pages/elder/Bookings';
import CallSupportPage from './pages/elder/CallSupportPage';
import Help from './pages/elder/Help';
import GroceriesPage from './pages/elder/GroceriesPage';
import HouseHelpPage from './pages/elder/HouseHelpPage';
import MedicinesPage from './pages/elder/MedicinesPage';
import Membership from './pages/elder/Membership';
import Payment from './pages/elder/Payment';
import Refer from './pages/elder/Refer';
import Rewards from './pages/elder/Rewards';
import Safety from './pages/elder/Safety';
import TransportPage from './pages/elder/TransportPage';
import FamilySupport from './pages/elder/familysupport';

import AdminLayout from './pages/admin/admin/components/AdminLayout';
import AdminDashboard from './pages/admin/admin/AdminDashboard';
import AdminHelpCenter from './pages/admin/admin/AdminHelpCenter';
import JobAssignment from './pages/admin/admin/JobAssignment';
import VolunteerManagement from './pages/admin/admin/VolunteerManagement';

import VolunteerLayout from './pages/volunteer/components/VolunteerLayout';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerMap from './pages/volunteer/VolunteerMap';
import VolunteerRequests from './pages/volunteer/VolunteerRequests';
import VolunteerHistory from './pages/volunteer/VolunteerHistory';
import VolunteerEarnings from './pages/volunteer/VolunteerEarnings';
import VolunteerEmergency from './pages/volunteer/VolunteerEmergency';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';
import VolunteerSupport from './pages/volunteer/VolunteerSupport';
import { DutyProvider } from './pages/volunteer/context/DutyContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/elder" element={<ElderHome />} />
        <Route path="/elder/profile" element={<ProfilePage />} />
        <Route path="/elder/bookings" element={<Bookings />} />
        <Route path="/elder/call-support" element={<CallSupportPage />} />
        <Route path="/elder/help" element={<Help />} />
        <Route path="/elder/groceries" element={<GroceriesPage />} />
        <Route path="/elder/house-help" element={<HouseHelpPage />} />
        <Route path="/elder/medicines" element={<MedicinesPage />} />
        <Route path="/elder/membership" element={<Membership />} />
        <Route path="/elder/payment" element={<Payment />} />
        <Route path="/elder/refer" element={<Refer />} />
        <Route path="/elder/rewards" element={<Rewards />} />
        <Route path="/elder/safety" element={<Safety />} />
        <Route path="/elder/transport" element={<TransportPage />} />
        <Route path="/elder/family-support" element={<FamilySupport />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<JobAssignment />} />
          <Route path="volunteers" element={<VolunteerManagement />} />
          <Route path="support" element={<AdminHelpCenter />} />
        </Route>

        <Route path="/volunteer" element={
          <DutyProvider>
            <VolunteerLayout />
          </DutyProvider>
        }>
          <Route index element={<VolunteerDashboard />} />
          <Route path="map" element={<VolunteerMap />} />
          <Route path="requests" element={<VolunteerRequests />} />
          <Route path="history" element={<VolunteerHistory />} />
          <Route path="earnings" element={<VolunteerEarnings />} />
          <Route path="emergency" element={<VolunteerEmergency />} />
          <Route path="profile" element={<VolunteerProfile />} />
          <Route path="support" element={<VolunteerSupport />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';

import ElderHome from './pages/elder/ElderHome';
import ProfilePage from './pages/elder/ProfilePage';

import AdminLayout from './pages/admin/admin/components/AdminLayout';
import AdminDashboard from './pages/admin/admin/AdminDashboard';
import AdminHelpCenter from './pages/admin/admin/AdminHelpCenter';

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

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminDashboard />} />
          <Route path="volunteers" element={<div className="p-6"><h2>Volunteer Management (Coming Soon)</h2></div>} />
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

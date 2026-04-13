import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import SimpleLogin from './components/Auth/SimpleLogin';
import { UserProvider } from './context/UserContext';

import ElderHome from './pages/elder/ElderHome';
import ElderDashboard from './pages/elder/ElderDashboard.tsx';
import ElderLayout from './pages/elder/components/ElderLayout';
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

import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerLayout from './pages/volunteer/components/VolunteerLayout';
import VolunteerMap from './pages/volunteer/VolunteerMap';
import VolunteerRequests from './pages/volunteer/VolunteerRequests';
import VolunteerHistory from './pages/volunteer/VolunteerHistory';
import VolunteerEarnings from './pages/volunteer/VolunteerEarnings';
import VolunteerEmergency from './pages/volunteer/VolunteerEmergency';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';
import VolunteerSupport from './pages/volunteer/VolunteerSupport';
import { DutyProvider } from './pages/volunteer/context/DutyContext';

import AdminLayout from './pages/admin/admin/components/AdminLayout';
import AdminDashboard from './pages/admin/admin/AdminDashboard';
import AdminHelpCenter from './pages/admin/admin/AdminHelpCenter';
import JobAssignment from './pages/admin/admin/JobAssignment';
import VolunteerManagement from './pages/admin/admin/VolunteerManagement';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<SimpleLogin />} />
        <Route path="/login" element={<SimpleLogin />} />
        
        {/* Elder Routes with Layout */}
        <Route path="/elder" element={<ElderLayout />}>
          <Route index element={<ElderDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="call-support" element={<CallSupportPage />} />
          <Route path="help" element={<Help />} />
          <Route path="groceries" element={<GroceriesPage />} />
          <Route path="house-help" element={<HouseHelpPage />} />
          <Route path="medicines" element={<MedicinesPage />} />
          <Route path="membership" element={<Membership />} />
          <Route path="payment" element={<Payment />} />
          <Route path="refer" element={<Refer />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="safety" element={<Safety />} />
          <Route path="transport" element={<TransportPage />} />
          <Route path="family-support" element={<FamilySupport />} />
        </Route>

        {/* Legacy Routes - Redirect to new routes */}
        <Route path="/elder-dashboard" element={<Navigate to="/elder" replace />} />
        <Route path="/elder-home" element={<Navigate to="/elder" replace />} />
        <Route path="/volunteer-dashboard" element={<Navigate to="/volunteer" replace />} />

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
    </UserProvider>
  );
}

export default App;

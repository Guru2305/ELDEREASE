import { useState } from 'react';
import { Users, UserCheck, FileText, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Stats {
  totalElders: number;
  totalVolunteers: number;
  activeRequests: number;
  completedToday: number;
}

interface VolunteerRequest {
  id: string;
  name: string;
  phone: string;
  area: string;
  services: string[];
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'volunteers' | 'requests'>('overview');

  const [stats] = useState<Stats>({
    totalElders: 142,
    totalVolunteers: 38,
    activeRequests: 12,
    completedToday: 27,
  });

  const [volunteers, setVolunteers] = useState<VolunteerRequest[]>([
    {
      id: '1',
      name: 'Kumar',
      phone: '+91 98765 43210',
      area: 'KK Nagar',
      services: ['groceries', 'medicines'],
      status: 'pending',
    },
    {
      id: '2',
      name: 'Priya',
      phone: '+91 98765 43211',
      area: 'KK Nagar',
      services: ['transport', 'household'],
      status: 'pending',
    },
    {
      id: '3',
      name: 'Ramesh',
      phone: '+91 98765 43212',
      area: 'Ashok Nagar',
      services: ['groceries', 'medicines', 'household'],
      status: 'approved',
    },
  ]);

  const handleApproveVolunteer = (id: string) => {
    setVolunteers(
      volunteers.map((v) => (v.id === id ? { ...v, status: 'approved' as const } : v))
    );
  };

  const handleRejectVolunteer = (id: string) => {
    setVolunteers(
      volunteers.map((v) => (v.id === id ? { ...v, status: 'rejected' as const } : v))
    );
  };

  const pendingVolunteers = volunteers.filter((v) => v.status === 'pending');
  const approvedVolunteers = volunteers.filter((v) => v.status === 'approved');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">{t('adminDashboard')}</h1>

          <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-lg font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-4 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-6 py-3 text-lg font-semibold transition-all ${
                activeTab === 'volunteers'
                  ? 'text-blue-600 border-b-4 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Volunteers
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 text-lg font-semibold transition-all ${
                activeTab === 'requests'
                  ? 'text-blue-600 border-b-4 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Requests
            </button>
          </div>

          {activeTab === 'overview' && (
            <div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                  <Users size={40} className="mb-3" />
                  <p className="text-3xl font-bold mb-1">{stats.totalElders}</p>
                  <p className="text-lg opacity-90">{t('totalElders')}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                  <UserCheck size={40} className="mb-3" />
                  <p className="text-3xl font-bold mb-1">{stats.totalVolunteers}</p>
                  <p className="text-lg opacity-90">{t('totalVolunteers')}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
                  <FileText size={40} className="mb-3" />
                  <p className="text-3xl font-bold mb-1">{stats.activeRequests}</p>
                  <p className="text-lg opacity-90">{t('activeRequests')}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                  <TrendingUp size={40} className="mb-3" />
                  <p className="text-3xl font-bold mb-1">{stats.completedToday}</p>
                  <p className="text-lg opacity-90">{t('completedToday')}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Area Coverage</h3>
                  <div className="space-y-3">
                    {['KK Nagar', 'Ashok Nagar', 'Vadapalani', 'T Nagar'].map((area) => (
                      <div key={area} className="flex justify-between items-center">
                        <span className="text-lg text-gray-700">{area}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-600 h-3 rounded-full"
                              style={{ width: `${Math.random() * 40 + 60}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-600">
                            {Math.floor(Math.random() * 20 + 10)} active
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Service Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { type: 'groceries', count: 45, color: 'bg-emerald-500' },
                      { type: 'medicines', count: 38, color: 'bg-blue-500' },
                      { type: 'transport', count: 28, color: 'bg-purple-500' },
                      { type: 'household', count: 31, color: 'bg-orange-500' },
                    ].map((service) => (
                      <div key={service.type} className="flex justify-between items-center">
                        <span className="text-lg text-gray-700 capitalize">{t(service.type)}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div
                              className={`${service.color} h-3 rounded-full`}
                              style={{ width: `${(service.count / 50) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-600">
                            {service.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'volunteers' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Volunteer Management</h2>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-orange-600 mb-4">
                  Pending Approvals ({pendingVolunteers.length})
                </h3>
                <div className="space-y-4">
                  {pendingVolunteers.map((volunteer) => (
                    <div
                      key={volunteer.id}
                      className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-gray-800 mb-2">
                            {volunteer.name}
                          </h4>
                          <p className="text-lg text-gray-600 mb-1">{volunteer.phone}</p>
                          <p className="text-lg text-gray-600 mb-3">Area: {volunteer.area}</p>
                          <div className="flex flex-wrap gap-2">
                            {volunteer.services.map((service) => (
                              <span
                                key={service}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold capitalize"
                              >
                                {t(service)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleApproveVolunteer(volunteer.id)}
                            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-all"
                          >
                            <CheckCircle size={24} />
                          </button>
                          <button
                            onClick={() => handleRejectVolunteer(volunteer.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-all"
                          >
                            <XCircle size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-green-600 mb-4">
                  Approved Volunteers ({approvedVolunteers.length})
                </h3>
                <div className="space-y-4">
                  {approvedVolunteers.map((volunteer) => (
                    <div
                      key={volunteer.id}
                      className="bg-green-50 border-2 border-green-200 rounded-2xl p-6"
                    >
                      <h4 className="text-2xl font-bold text-gray-800 mb-2">{volunteer.name}</h4>
                      <p className="text-lg text-gray-600 mb-1">{volunteer.phone}</p>
                      <p className="text-lg text-gray-600 mb-3">Area: {volunteer.area}</p>
                      <div className="flex flex-wrap gap-2">
                        {volunteer.services.map((service) => (
                          <span
                            key={service}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold capitalize"
                          >
                            {t(service)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Management</h2>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
                <FileText size={64} className="mx-auto mb-4 text-blue-500" />
                <p className="text-xl text-gray-600">
                  Request monitoring and management features coming soon
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

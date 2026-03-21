import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, HeartHandshake } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">ElderAssist</h1>
      <p className="text-slate-600 mb-12 text-center">Select your role to continue</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Elder Role */}
        <button
          onClick={() => navigate('/elder')}
          className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-emerald-500 group"
        >
          <div className="bg-emerald-100 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform">
            <User className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Senior Citizen</h2>
          <p className="text-slate-500 text-center">Access easy assistance, SOS, and services</p>
        </button>

        {/* Admin Role */}
        <button
          onClick={() => navigate('/admin')}
          className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 group"
        >
          <div className="bg-blue-100 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform">
            <Users className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin / Support</h2>
          <p className="text-slate-500 text-center">Manage requests and assign volunteers</p>
        </button>

        {/* Volunteer Role */}
        <button
          onClick={() => navigate('/volunteer')}
          className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-amber-500 group"
        >
          <div className="bg-amber-100 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform">
            <HeartHandshake className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Volunteer</h2>
          <p className="text-slate-500 text-center">Help others and earn rewards</p>
        </button>
      </div>
    </div>
  );
}

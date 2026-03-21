import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, LifeBuoy, LogOut, Bell } from 'lucide-react';

export default function AdminLayout() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <img src="/images/logo.png" alt="ElderlyCare Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">ElderlyCare</h1>
                        <p className="text-xs text-slate-400 font-medium">Admin Console</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
                        }
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/jobs"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
                        }
                    >
                        <ClipboardList className="w-5 h-5" />
                        Job Assignment
                    </NavLink>
                    <NavLink
                        to="/admin/volunteers"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
                        }
                    >
                        <Users className="w-5 h-5" />
                        Volunteers
                    </NavLink>
                    <NavLink
                        to="/admin/support"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
                        }
                    >
                        <LifeBuoy className="w-5 h-5" />
                        Help Center
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-lg w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-700">Overview</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
                            A
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

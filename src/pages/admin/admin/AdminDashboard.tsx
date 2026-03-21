import React, { useState, useEffect } from 'react';
import {
    ClipboardList, User, CheckCircle, AlertTriangle,
    Activity, Bell, MoreHorizontal, Clock, MapPin, Navigation
} from 'lucide-react';
import AdminAnalytics from './components/AdminAnalytics';
import RequestService from '../../../services/RequestService';
import type { ServiceRequest } from '../../../services/RequestService';

export default function AdminDashboard() {
    const [allRequests, setAllRequests] = useState<ServiceRequest[]>([]);
    const [stats, setStats] = useState({
        activeSOS: 0,
        pendingRequests: 0,
        activeVolunteers: 12,
        totalCompleted: 1245
    });

    // Load and monitor all requests
    useEffect(() => {
        // Load existing requests
        RequestService.loadStoredRequests();
        
        // Subscribe to request updates
        const unsubscribe = RequestService.subscribe((requests: ServiceRequest[]) => {
            setAllRequests(requests);
            
            // Calculate real-time stats
            const pendingCount = requests.filter(req => req.status === 'pending').length;
            const sosCount = requests.filter(req => req.urgent && req.status === 'pending').length;
            
            setStats(prev => ({
                ...prev,
                pendingRequests: pendingCount,
                activeSOS: sosCount
            }));
        });
        
        return unsubscribe;
    }, []);

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-500';
            case 'accepted': return 'bg-blue-500';
            case 'completed': return 'bg-emerald-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getActivityMessage = (request: ServiceRequest) => {
        switch (request.status) {
            case 'pending':
                return request.urgent 
                    ? `SOS Alert: ${request.taskType} requested by ${request.elderName}`
                    : `New Request: ${request.taskType} by ${request.elderName}`;
            case 'accepted':
                return `Request Accepted: ${request.taskType} assigned to volunteer`;
            case 'completed':
                return `Task Completed: ${request.taskType} by ${request.elderName} finished`;
            default:
                return `Request Updated: ${request.taskType}`;
        }
    };
    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>
                    <p className="text-slate-500 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Operational • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-3">

                    <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 shadow-sm flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        System Health
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    label="Active SOS"
                    value={stats.activeSOS.toString()}
                    color="red"
                    icon={<AlertTriangle />}
                    trend={stats.activeSOS > 0 ? `${stats.activeSOS} active now` : 'No active SOS'}
                    trendColor="text-red-600"
                />
                <StatsCard
                    label="Pending Requests"
                    value={stats.pendingRequests.toString()}
                    color="amber"
                    icon={<ClipboardList />}
                    trend="Real-time updates"
                    trendColor="text-amber-600"
                />
                <StatsCard
                    label="Active Volunteers"
                    value={stats.activeVolunteers.toString()}
                    color="emerald"
                    icon={<User />}
                    trend="Monitoring system"
                    trendColor="text-emerald-600"
                />
                <StatsCard
                    label="Total Completed"
                    value={stats.totalCompleted.toLocaleString()}
                    color="blue"
                    icon={<CheckCircle />}
                    trend="+18% vs last week"
                    trendColor="text-blue-600"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left Column: Analytics */}
                <div className="xl:col-span-2 space-y-6">
                    <AdminAnalytics />
                </div>

                {/* Right Column: Recent Activity & Notifications */}
                <div className="space-y-6">

                    {/* Recent Activity Feed */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-semibold text-slate-800">Live Request Monitor</h3>
                            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {allRequests.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                    <p>No requests in system</p>
                                    <p className="text-sm mt-1">Requests from elders will appear here</p>
                                </div>
                            ) : (
                                allRequests
                                    .sort((a, b) => b.timestamp - a.timestamp)
                                    .slice(0, 10)
                                    .map((request, idx) => (
                                        <div key={request.id} className="p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${getStatusColor(request.status)}`}></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-800 font-medium">
                                                    {getActivityMessage(request)}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {request.elderName}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {request.location}
                                                    </span>
                                                    {request.acceptedVolunteer && (
                                                        <span className="flex items-center gap-1 text-blue-600">
                                                            <Navigation className="w-3 h-3" />
                                                            {request.acceptedVolunteer}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatTime(request.timestamp)}
                                                </p>
                                                {request.message && (
                                                    <p className="text-xs text-slate-600 mt-1 italic">
                                                        "{request.message}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    request.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    request.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                    request.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                                {request.urgent && (
                                                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                                        URGENT
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                                View All Requests ({allRequests.length})
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions / System Status */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Activity className="w-24 h-24" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">System Status</h3>
                        <p className="text-slate-300 text-sm mb-4">All dispatcher nodes operational.</p>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Server Load</span>
                                <span className="text-emerald-400 font-mono">12%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                                <div className="bg-emerald-500 h-1.5 rounded-full w-[12%]"></div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Database</span>
                                <span className="text-emerald-400 font-mono">Healthy</span>
                            </div>

                            <button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors border border-white/10">
                                Run Diagnostics
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// --- Components ---

function StatsCard({ label, value, color, icon, trend, trendColor }: any) {
    const colorStyles: any = {
        red: 'bg-red-50 text-red-600 border-red-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p - 3 rounded - lg ${colorStyles[color]} `}>
                    {React.cloneElement(icon, { className: "w-6 h-6" })}
                </div>
                <span className={`text - xs font - medium px - 2 py - 1 rounded - full bg - slate - 100 ${trendColor} `}>
                    {trend}
                </span>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-slate-800 group-hover:scale-105 transition-transform origin-left">{value}</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">{label}</p>
            </div>
        </div>
    );
}


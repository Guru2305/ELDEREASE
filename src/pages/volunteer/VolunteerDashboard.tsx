import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Phone, CheckCircle, AlertTriangle, Star, Award, TrendingUp } from 'lucide-react';
import DutyProtection from './components/DutyProtection';
import NotificationPopup from './components/NotificationPopup';
import { useUser } from '../../context/UserContext';
import { bookingAPI } from '../../services/api';
import { 
    processAndRankRequests, 
    VolunteerProfile, 
    PriorityRequest,
    getCurrentLocation,
    watchLocation
} from './algorithms/PriorityScoring';
import { getEmergencyChecklist, ChecklistItem } from './algorithms/EmergencyChecklist';
import { openSmartNavigation, NavigationLocation } from './algorithms/SmartNavigation';
import { DutyProvider } from './context/DutyContext';

export default function VolunteerDashboard() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<'feed' | 'active'>('feed');
    const [activeTask, setActiveTask] = useState<PriorityRequest | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<any>(null);
    const [processedRequests, setProcessedRequests] = useState<PriorityRequest[]>([]);
    const [showChecklist, setShowChecklist] = useState(false);
    const [currentChecklist, setCurrentChecklist] = useState<ChecklistItem[]>([]);
    const [volunteerLocation, setVolunteerLocation] = useState({ latitude: 13.0827, longitude: 80.2707 });
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isTrackingLocation, setIsTrackingLocation] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile>({
        volunteer_id: user?.id || 'volunteer_001',
        skills: user?.skills || ['first aid', 'medicine delivery', 'companion care', 'emergency response', 'grocery shopping', 'household help', 'medical escort', 'mobility assistance', 'tech support'],
        trust_score: 0.85,
        availability_status: 1,
        location: { latitude: 13.0827, longitude: 80.2707 }
    });

    useEffect(() => {
        if (!user) return;
        
        const fetchBookings = async () => {
            try {
                const response = await bookingAPI.getAvailable();
                const bookings = response.data || [];
                const pendingRequests = bookings.filter(booking => booking.status === 'pending');
                
                const processed = processAndRankRequests(
                    pendingRequests.map(booking => ({
                        id: booking.id,
                        taskType: booking.serviceType,
                        title: booking.title,
                        location: booking.elderAddress?.city || 'Unknown Location',
                        coordinates: { latitude: 13.0827, longitude: 80.2707 }, // Default coordinates
                        distance: 0,
                        earnings: 'Volunteer',
                        urgent: booking.serviceType === 'emergency',
                        elderName: booking.elderName,
                        required_skills: ['general assistance'],
                        emergency_features: {
                            fall_detected: booking.serviceType === 'emergency',
                            heart_rate_change: booking.serviceType === 'emergency' ? 30 : 5,
                            inactivity_duration: booking.serviceType === 'emergency' ? 20 : 60,
                            panic_text_score: booking.serviceType === 'emergency' ? 0.8 : 0.2,
                            response_delay: booking.serviceType === 'emergency' ? 3 : 15
                        },
                        message: booking.description
                    })),
                    volunteerProfile,
                    5
                );
                setProcessedRequests(processed);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to load bookings');
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user, volunteerProfile]);

    useEffect(() => {
        getCurrentLocation()
            .then((location) => {
                setVolunteerLocation(location);
                setVolunteerProfile(prev => ({ ...prev, location }));
                setLocationError(null);
                setIsTrackingLocation(true);
                
                return watchLocation((newLocation) => {
                    setVolunteerLocation(newLocation);
                    setVolunteerProfile(prev => ({ ...prev, location: newLocation }));
                });
            })
            .catch((err) => {
                console.error('Error getting location:', err);
                setLocationError('Unable to get your location. Using default location.');
                setIsTrackingLocation(false);
            });
    }, []);

    const handleAccept = async (task: PriorityRequest) => {
        try {
            await bookingAPI.accept(task.id.toString());
            setActiveTask(task);
            setActiveTab('active');
            const checklist = getEmergencyChecklist(task.taskType, 'MEDIUM');
            setCurrentChecklist(checklist.items || []);
            setShowChecklist(true);
        } catch (error) {
            console.error('Failed to accept booking:', error);
            alert('Failed to accept request. Please try again.');
        }
    };

    const handleNavigate = (task: PriorityRequest) => {
        if (task.coordinates) {
            const location: NavigationLocation = {
                latitude: task.coordinates.latitude,
                longitude: task.coordinates.longitude,
                address: task.location
            };
            openSmartNavigation(location);
        }
    };

    const toggleChecklistItem = (itemId: string) => {
        setCurrentChecklist(prev => 
            prev.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
        );
    };

    const stats = [
        { label: 'Tasks Completed', value: '24', icon: CheckCircle, color: 'text-green-600' },
        { label: 'People Helped', value: '18', icon: Star, color: 'text-blue-600' },
        { label: 'Total Earnings', value: '₹1,250', icon: Award, color: 'text-emerald-600' },
        { label: 'Success Rate', value: '98%', icon: TrendingUp, color: 'text-purple-600' }
    ];

    return (
        <DutyProvider>
            <DutyProtection>
                {loading ? (
                    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
                        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md">
                            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                            <h2 className="text-xl font-bold mb-2">Dashboard Error</h2>
                            <p className="text-slate-600 mb-4">{error}</p>
                            <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Reload</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Volunteer Profile Info - Fixed Duplicate Paste */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">Volunteer Profile</h2>
                                <p className="text-sm text-slate-500">Skills: {volunteerProfile.skills.slice(0, 3).join(', ')}...</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${isTrackingLocation ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                                    <span className="text-xs text-slate-500">{isTrackingLocation ? 'Live Tracking' : 'Location Unknown'}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                                    🥇 Gold Trust
                                </div>
                                <p className="text-xs text-slate-400 mt-1">📍 {volunteerLocation.latitude.toFixed(4)}, {volunteerLocation.longitude.toFixed(4)}</p>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-slate-500">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                    </div>
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                            ))}
                        </div>

                        {/* Task Management */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Task Management</h2>
                                <div className="flex gap-2">
                                    <button onClick={() => setActiveTab('feed')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'feed' ? 'bg-amber-500 text-white' : 'bg-slate-100'}`}>Available</button>
                                    <button onClick={() => setActiveTab('active')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'active' ? 'bg-amber-500 text-white' : 'bg-slate-100'}`}>Active</button>
                                </div>
                            </div>

                            <div className="p-6">
                                {activeTab === 'feed' ? (
                                    <div className="space-y-4">
                                        {processedRequests.length > 0 ? processedRequests.map(task => (
                                            <div key={task.id} className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-xs font-bold px-2 py-1 bg-blue-100 rounded-full">Score: {task.priority_score}</span>
                                                    <span className="font-bold text-emerald-600">{task.earnings}</span>
                                                </div>
                                                <h4 className="font-bold mb-2">{task.taskType}</h4>
                                                <p className="text-sm text-slate-500 mb-4 flex items-center gap-1"><MapPin className="w-4 h-4" /> {task.location}</p>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleAccept(task)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium">Accept Request</button>
                                                </div>
                                            </div>
                                        )) : <p className="text-center text-slate-500 py-4">No tasks nearby.</p>}
                                    </div>
                                ) : (
                                    activeTask ? (
                                        <div className="space-y-4">
                                            <div className="bg-slate-50 p-4 rounded-lg">
                                                <h3 className="font-bold text-lg">{activeTask.taskType}</h3>
                                                <p className="text-sm text-slate-500 mb-4">{activeTask.location}</p>
                                                <div className="flex gap-4">
                                                    <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> Call</button>
                                                    <button onClick={() => handleNavigate(activeTask)} className="flex-1 bg-amber-50 text-amber-600 py-2 rounded-lg flex items-center justify-center gap-2"><Navigation className="w-4 h-4" /> Navigate</button>
                                                </div>
                                            </div>
                                            {showChecklist && (
                                                <div className="border rounded-lg p-4 space-y-2">
                                                    <h4 className="font-bold flex items-center gap-2"><Award className="w-5 h-5" /> Checklist</h4>
                                                    {currentChecklist.map(item => (
                                                        <div key={item.id} onClick={() => toggleChecklistItem(item.id)} className="flex items-center gap-3 p-2 bg-slate-50 rounded cursor-pointer">
                                                            <input type="checkbox" checked={item.completed} readOnly />
                                                            <span className={`text-sm ${item.completed ? 'line-through text-slate-400' : ''}`}>{item.item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <button onClick={() => {setActiveTask(null); setActiveTab('feed');}} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">Complete Task</button>
                                        </div>
                                    ) : <p className="text-center text-slate-500">No active task.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <NotificationPopup isVisible={showNotification} onClose={() => setShowNotification(false)} {...currentNotification} />
            </DutyProtection>
    </DutyProvider>
    );
}
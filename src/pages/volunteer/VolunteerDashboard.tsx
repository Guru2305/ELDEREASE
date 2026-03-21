import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Phone, CheckCircle, Clock, AlertTriangle, TrendingUp, Users, DollarSign, Star, Award } from 'lucide-react';
import MockMap from '../../components/shared/MockMap';
import DutyProtection from './components/DutyProtection';
import NotificationPopup from './components/NotificationPopup';
import RequestService from '../../services/RequestService';
import type { ServiceRequest } from '../../services/RequestService';
import { 
    processAndRankRequests, 
    VolunteerProfile, 
    PriorityRequest, 
    getTrustLevel,
    calculateTrustScore,
    EmergencyFeatures,
    getCurrentLocation,
    watchLocation 
} from './algorithms/PriorityScoring';
import { getEmergencyChecklist, ChecklistItem } from './algorithms/EmergencyChecklist';
import { openSmartNavigation, NavigationLocation } from './algorithms/SmartNavigation';

export default function VolunteerDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'feed' | 'active'>('feed');
    const [activeTask, setActiveTask] = useState<any>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<any>(null);
    const [processedRequests, setProcessedRequests] = useState<PriorityRequest[]>([]);
    const [showChecklist, setShowChecklist] = useState(false);
    const [currentChecklist, setCurrentChecklist] = useState<ChecklistItem[]>([]);
    const [liveRequests, setLiveRequests] = useState<ServiceRequest[]>([]);
    const [volunteerLocation, setVolunteerLocation] = useState({ latitude: 13.0827, longitude: 80.2707 });
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isTrackingLocation, setIsTrackingLocation] = useState(false);

    // Dynamic volunteer profile with real-time location
    const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile>({
        volunteer_id: 'volunteer_001',
        skills: ['first aid', 'medicine delivery', 'companion care', 'emergency response', 'grocery shopping', 'household help', 'medical escort', 'mobility assistance', 'tech support'],
        trust_score: 0.85, // High trust score
        availability_status: 1, // Available
        location: { latitude: 13.0827, longitude: 80.2707 }
    });

    // Load stored requests and listen for new ones
    useEffect(() => {
        // Load existing requests from storage
        RequestService.loadStoredRequests();
        
        // Subscribe to new requests
        const unsubscribe = RequestService.subscribe((requests: ServiceRequest[]) => {
            const pendingRequests = requests.filter(req => req.status === 'pending');
            setLiveRequests(pendingRequests);
            
            // Process and rank the new requests based on proximity and urgency
            try {
                const processed = processAndRankRequests(
                    pendingRequests.map(req => ({
                        id: parseInt(req.id),
                        taskType: req.taskType,
                        title: req.taskType,
                        location: req.location,
                        coordinates: req.coordinates,
                        distance: 0, // Will be calculated by algorithm based on proximity
                        earnings: req.urgent ? 'Volunteer' : '₹50',
                        urgent: req.urgent,
                        elderName: req.elderName,
                        required_skills: ['general assistance'], // All requests available (no skill filtering)
                        emergency_features: {
                            fall_detected: req.emergency_severity === 'HIGH',
                            heart_rate_change: req.urgent ? 30 : 5,
                            inactivity_duration: req.urgent ? 20 : 60,
                            panic_text_score: req.urgent ? 0.8 : 0.2,
                            response_delay: req.urgent ? 3 : 15
                        },
                        message: req.message
                    })),
                    volunteerProfile,
                    5 // 5km radius for proximity-based requests
                );
                setProcessedRequests(processed);
            } catch (error) {
                console.error('Error processing requests:', error);
            }
        });
        
        return unsubscribe;
    }, [volunteerProfile]);

    const stats = [
        { label: 'Tasks Completed', value: '24', icon: 'CheckCircle', color: 'text-green-600' },
        { label: 'People Helped', value: '18', icon: 'Users', color: 'text-blue-600' },
        { label: 'Total Earnings', value: '₹1,250', icon: 'DollarSign', color: 'text-emerald-600' },
        { label: 'Success Rate', value: '98%', icon: 'TrendingUp', color: 'text-purple-600' }
    ];

    // Real-time location tracking
    useEffect(() => {
        // Get initial location
        getCurrentLocation()
            .then((location) => {
                setVolunteerLocation(location);
                setVolunteerProfile(prev => ({ ...prev, location }));
                setLocationError(null);
                setIsTrackingLocation(true);
                
                // Start watching location for real-time updates
                const stopWatching = watchLocation((newLocation) => {
                    setVolunteerLocation(newLocation);
                    setVolunteerProfile(prev => ({ ...prev, location: newLocation }));
                });

                return () => {
                    stopWatching();
                    setIsTrackingLocation(false);
                };
            })
            .catch((error) => {
                console.error('Error getting location:', error);
                setLocationError('Unable to get your location. Using default location.');
                setIsTrackingLocation(false);
            });
    }, []);

    const handleAccept = (task: PriorityRequest) => {
        try {
            // Accept the request in RequestService
            const success = RequestService.acceptRequest(
                task.id.toString(), 
                volunteerProfile.volunteer_id,
                `Volunteer ${volunteerProfile.volunteer_id}`
            );
            
            if (success) {
                setActiveTask(task);
                setActiveTab('active');
                
                // Generate emergency checklist
                const checklist = getEmergencyChecklist(task.taskType, task.emergency_severity || 'MEDIUM');
                setCurrentChecklist(checklist.items || []);
                setShowChecklist(true);
            } else {
                console.error('Failed to accept request - may already be accepted');
            }
        } catch (error) {
            console.error('Error accepting task:', error);
            // Fallback behavior
            setActiveTask(task);
            setActiveTab('active');
        }
    };

    const handleNavigate = (task: PriorityRequest) => {
        try {
            if (task.coordinates) {
                const location: NavigationLocation = {
                    latitude: task.coordinates.latitude,
                    longitude: task.coordinates.longitude,
                    address: task.location
                };
                openSmartNavigation(location);
            }
        } catch (error) {
            console.error('Error navigating:', error);
            // Fallback to sessionStorage method
            sessionStorage.setItem('navigationLocation', task.location);
            navigate('/volunteer/map');
        }
    };

    const handleCompleteTask = () => {
        setActiveTask(null);
        setActiveTab('feed');
        setShowChecklist(false);
        setCurrentChecklist([]);
    };

    const toggleChecklistItem = (itemId: string) => {
        setCurrentChecklist(prev => 
            prev.map(item => 
                item.id === itemId ? { ...item, completed: !item.completed } : item
            )
        );
    };

    // Notification system with 10-second intervals
    useEffect(() => {
        const showRandomNotification = () => {
            try {
                if (processedRequests.length > 0) {
                    const randomTask = processedRequests[Math.floor(Math.random() * processedRequests.length)];
                    setCurrentNotification({
                        elderName: randomTask.elderName || 'Unknown',
                        taskType: randomTask.title || 'Service Request',
                        taskId: randomTask.id
                    });
                    setShowNotification(true);
                }
            } catch (error) {
                console.error('Error showing notification:', error);
            }
        };

        // Show first notification after 2 seconds
        const initialTimer = setTimeout(showRandomNotification, 2000);
        
        // Then show notifications every 10 seconds
        const interval = setInterval(showRandomNotification, 10000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [processedRequests]);

    const closeNotification = () => {
        setShowNotification(false);
        setCurrentNotification(null);
    };

    return (
        <DutyProtection>
            <div className="space-y-6">
            {/* Volunteer Profile Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Volunteer Profile</h2>
                        <p className="text-sm text-slate-500">Skills: {volunteerProfile.skills.join(', ')}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${
                                isTrackingLocation ? 'bg-green-500 animate-pulse' : 'bg-slate-300'
                            }`} />
                            <span className="text-xs text-slate-500">
                                {isTrackingLocation ? 'Live Tracking' : 'Location Unknown'}
                            </span>
                            {locationError && (
                                <span className="text-xs text-amber-600">{locationError}</span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            volunteerProfile.trust_score >= 0.8 ? 'bg-amber-100 text-amber-800' :
                            volunteerProfile.trust_score >= 0.6 ? 'bg-slate-100 text-slate-800' :
                            'bg-bronze-100 text-bronze-800'
                        }`}>
                            {volunteerProfile.trust_score >= 0.8 ? '🥇 Gold' :
                             volunteerProfile.trust_score >= 0.6 ? '🥈 Silver' : '🥉 Bronze'} Trust
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Score: {Math.round(volunteerProfile.trust_score * 100)}%</p>
                        <p className="text-xs text-slate-400">
                            📍 {volunteerLocation.latitude.toFixed(4)}, {volunteerLocation.longitude.toFixed(4)}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                            </div>
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Task Management */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-800">Task Management</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('feed')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === 'feed' 
                                        ? 'bg-amber-500 text-white' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                Available Tasks
                            </button>
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === 'active' 
                                        ? 'bg-amber-500 text-white' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                Active Task
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'feed' ? (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-700">Nearby Requests (Priority Ranked)</h3>
                            {processedRequests && processedRequests.length > 0 ? (
                                processedRequests.map((task) => (
                                <div key={task.id} className={`bg-slate-50 p-4 rounded-lg border-l-4 ${
                                    task.emergency_severity === 'HIGH' ? 'border-red-500' : 
                                    task.emergency_severity === 'MEDIUM' ? 'border-amber-500' : 'border-blue-500'
                                }`}>
                                    {/* Priority Score and Trust Level */}
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
                                                Score: {task.priority_score}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                task.emergency_severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                                                task.emergency_severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {task.emergency_severity}
                                            </span>
                                            {task.distress_level === 'Panic' && (
                                                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                                    PANIC
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-bold text-emerald-600">{task.earnings}</span>
                                    </div>

                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                            {task.emergency_severity === 'HIGH' && <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />}
                                            {task.title}
                                        </h4>
                                    </div>

                                    <div className="text-sm text-slate-500 space-y-1 mb-4">
                                        <p className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {task.location}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Navigation className="w-4 h-4" />
                                            {task.distance.toFixed(1)} km away • ETA: {task.estimated_arrival_time} min
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Star className="w-4 h-4" />
                                            Skill Match: {Math.round(task.skill_match_score * 100)}%
                                        </p>
                                        {task.message && (
                                            <p className="bg-slate-100 p-2 rounded text-slate-700 italic">
                                                "{task.message}"
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg font-medium text-sm">Ignore</button>
                                        <button
                                            onClick={() => handleAccept(task)}
                                            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                                                task.emergency_severity === 'HIGH' 
                                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            }`}
                                        >
                                            {task.emergency_severity === 'HIGH' ? 'EMERGENCY ACCEPT' : 'Accept Request'}
                                        </button>
                                    </div>
                                </div>
                        ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-500">No requests available at the moment.</p>
                                    <p className="text-sm text-slate-400 mt-2">Check back soon for new service requests.</p>
                                </div>
                            )}
                        </div>
                ) : (
                    <div className="h-full flex flex-col">
                        <div className="bg-slate-50 p-4 rounded-lg mb-4">
                            <h3 className="font-bold text-slate-800 text-lg mb-1">{activeTask?.taskType}</h3>
                            <p className="text-slate-500 text-sm mb-4">{activeTask?.location}</p>

                            <div className="flex gap-4 mb-4">
                                <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg flex items-center justify-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Call Elder
                                </button>
                                <button 
                                    onClick={() => handleNavigate(activeTask!)}
                                    className="flex-1 bg-amber-50 text-amber-600 py-2 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <Navigation className="w-4 h-4" />
                                    Navigate
                                </button>
                            </div>

                            {/* Emergency Checklist */}
                            {showChecklist && currentChecklist.length > 0 && (
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-amber-600" />
                                        Emergency Checklist
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {currentChecklist.map((item) => (
                                            <div 
                                                key={item.id}
                                                className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                                                    item.completed 
                                                        ? 'bg-green-50 border-green-200' 
                                                        : 'bg-slate-50 border-slate-200'
                                                }`}
                                                onClick={() => toggleChecklistItem(item.id)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={item.completed}
                                                    onChange={() => toggleChecklistItem(item.id)}
                                                    className="w-4 h-4"
                                                />
                                                <span className={`flex-1 text-sm ${
                                                    item.completed ? 'text-slate-500 line-through' : 'text-slate-700'
                                                }`}>
                                                    {item.task}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded ${
                                                    item.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                                    item.priority === 'important' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {item.priority}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-6">
                            <h4 className="font-semibold text-slate-800 mb-4">Task Progress</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-slate-600">Status</span>
                                    <span className="font-medium text-emerald-600">In Progress</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-slate-600">Started</span>
                                    <span className="font-medium text-slate-800">Just now</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-slate-600">Estimated Time</span>
                                    <span className="font-medium text-slate-800">{activeTask?.estimated_arrival_time} min</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCompleteTask}
                                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                            >
                                Mark as Completed
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
    
    {/* Notification Popup */}
    <NotificationPopup
        isVisible={showNotification}
        onClose={closeNotification}
        elderName={currentNotification?.elderName || 'Unknown'}
        taskType={currentNotification?.taskType || 'Service Request'}
        taskId={currentNotification?.taskId}
    />
    </DutyProtection>
);
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Navigation } from 'lucide-react';
import DutyProtection from './components/DutyProtection';
import { 
    processAndRankRequests, 
    VolunteerProfile, 
    PriorityRequest
} from './algorithms/PriorityScoring';
import RequestService from '../../services/RequestService';
import type { ServiceRequest } from '../../services/RequestService';
import { getEmergencyChecklist, ChecklistItem } from './algorithms/EmergencyChecklist';
import { openSmartNavigation, NavigationLocation } from './algorithms/SmartNavigation';

export default function VolunteerRequests() {
    const navigate = useNavigate();
    const [processedRequests, setProcessedRequests] = useState<PriorityRequest[]>([]);
    const [showChecklist, setShowChecklist] = useState(false);
    const [currentChecklist, setCurrentChecklist] = useState<ChecklistItem[]>([]);
    const [activeTask, setActiveTask] = useState<PriorityRequest | null>(null);

    // Dynamic volunteer profile with real-time location
    const volunteerProfile: VolunteerProfile = {
        volunteer_id: 'volunteer_001',
        skills: ['first aid', 'medicine delivery', 'companion care', 'emergency response', 'grocery shopping', 'household help', 'medical escort', 'mobility assistance', 'tech support'],
        trust_score: 0.85, // High trust score
        availability_status: 1, // Available
        location: { latitude: 13.0827, longitude: 80.2707 }
    };

    // Load stored requests and listen for new ones
    useEffect(() => {
        // Load existing requests from storage
        RequestService.loadStoredRequests();
        
        // Subscribe to new requests
        const unsubscribe = RequestService.subscribe((requests: ServiceRequest[]) => {
            const pendingRequests = requests.filter(req => req.status === 'pending');
            
            // Process and rank new requests based on proximity and urgency
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
                
                // Generate emergency checklist
                const checklist = getEmergencyChecklist(task.taskType, task.emergency_severity || 'MEDIUM');
                setCurrentChecklist(checklist.items || []);
                setShowChecklist(true);
            } else {
                console.error('Failed to accept request - may already be accepted');
            }
        } catch (error) {
            console.error('Error accepting task:', error);
            setActiveTask(task);
        }
    };

    const handleNavigate = (task: PriorityRequest) => {
        try {
            // Open smart navigation
            const navigationLocation: NavigationLocation = {
                latitude: task.coordinates?.latitude || volunteerProfile.location.latitude,
                longitude: task.coordinates?.longitude || volunteerProfile.location.longitude,
                address: task.location || 'Unknown Location'
            };
            
            openSmartNavigation(navigationLocation);
            navigate('/volunteer/map');
        } catch (error) {
            console.error('Error opening navigation:', error);
        }
    };

    const toggleChecklistItem = (itemId: string) => {
        setCurrentChecklist(prev => 
            prev.map(item => 
                item.id === itemId 
                    ? { ...item, completed: !item.completed }
                    : item
            )
        );
    };

    const closeChecklist = () => {
        setShowChecklist(false);
        setCurrentChecklist([]);
        setActiveTask(null);
    };

    return (
        <DutyProtection>
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
                                <div className="flex items-center gap-2">
                                    <Navigation className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm text-gray-600">
                                        Location: Chennai
                                    </span>
                                </div>
                            </div>

                            {/* Requests List */}
                            <div className="space-y-4">
                                {processedRequests.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-gray-500 text-lg">
                                            No requests available at the moment.
                                        </div>
                                        <div className="text-gray-400 text-sm mt-2">
                                            Requests from elders will appear here automatically.
                                        </div>
                                    </div>
                                ) : (
                                    processedRequests.map((request, index) => (
                                        <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className={`
                                                            px-3 py-1 rounded-full text-xs font-semibold
                                                            ${request.emergency_severity === 'HIGH' ? 'bg-red-100 text-red-700' :
                                                              request.emergency_severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                                                              'bg-green-100 text-green-700'}
                                                        `}>
                                                            Priority #{index + 1}
                                                        </div>
                                                        {request.urgent && (
                                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                                URGENT
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {request.elderName}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">
                                                        {request.taskType}
                                                    </p>
                                                    <p className="text-gray-500 text-sm">
                                                        {request.location}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {request.earnings}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {request.distance} km away
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{request.distance} km</span>
                                                    <Clock className="w-4 h-4 ml-3" />
                                                    <span>ETA: {request.eta} min</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAccept(request)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                                    >
                                                        Accept Request
                                                    </button>
                                                    <button
                                                        onClick={() => handleNavigate(request)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                                    >
                                                        Navigate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency Checklist Modal */}
                {showChecklist && activeTask && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 max-h-[80vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Emergency Checklist: {activeTask.taskType}
                                    </h2>
                                    <button
                                        onClick={closeChecklist}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    {currentChecklist.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={item.completed}
                                                onChange={() => toggleChecklistItem(item.id)}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                            <label className={`flex-1 ${item.completed ? 'line-through text-gray-400' : ''}`}>
                                                <span className="font-medium">{item.item}</span>
                                                {item.urgent && (
                                                    <span className="ml-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                                                        Critical
                                                    </span>
                                                )}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={closeChecklist}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                                    >
                                        Complete Checklist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DutyProtection>
    );
}

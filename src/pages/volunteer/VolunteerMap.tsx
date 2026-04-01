import { useState, useEffect } from 'react';
import DutyProtection from './components/DutyProtection';
import RealMap from '../../components/shared/RealMap';
import { getCurrentLocation, watchLocation } from './algorithms/PriorityScoring';

// All request locations data with coordinates and algorithmic features
const allRequestLocations = [
    {
        id: 1,
        location: '3rd Cross Street, Anna Nagar',
        elderName: 'Mrs. Saraswati',
        taskType: 'Fall Detected - Emergency',
        urgent: true,
        coordinates: { latitude: 13.0850, longitude: 80.2720 },
        distance: 0.5,
        required_skills: ['emergency response', 'first aid'],
        emergency_features: {
            fall_detected: true,
            heart_rate_change: 40,
            inactivity_duration: 15,
            panic_text_score: 0.9,
            response_delay: 3
        },
        message: 'FALL DETECTED! Please help immediately! Cannot move!',
        priorityScore: 0.95,
        emergency_severity: 'HIGH'
    },
    {
        id: 2,
        location: '6th Avenue, Besant Nagar',
        elderName: 'Mrs. Meenakshi',
        taskType: 'Gas Leak - Evacuation',
        urgent: true,
        coordinates: { latitude: 13.1020, longitude: 80.2920 },
        distance: 1.2,
        required_skills: ['emergency response'],
        emergency_features: {
            fall_detected: false,
            heart_rate_change: 18,
            inactivity_duration: 20,
            panic_text_score: 0.8,
            response_delay: 3
        },
        message: 'Smell gas strongly! Need help getting out of apartment immediately!',
        priorityScore: 0.88,
        emergency_severity: 'HIGH'
    },
    {
        id: 3,
        location: '8th Cross Street, T. Nagar',
        elderName: 'Mr. Srinivasan',
        taskType: 'Stuck in Elevator',
        urgent: true,
        coordinates: { latitude: 13.0450, longitude: 80.2350 },
        distance: 1.5,
        required_skills: ['emergency response', 'mobility assistance'],
        emergency_features: {
            fall_detected: false,
            heart_rate_change: 15,
            inactivity_duration: 25,
            panic_text_score: 0.6,
            response_delay: 4
        },
        message: 'Power went out and I\'m stuck in elevator between floors! Need help!',
        priorityScore: 0.82,
        emergency_severity: 'HIGH'
    },
    {
        id: 4,
        location: '3rd Floor, Rose Apartments',
        elderName: 'Mrs. Annapurna',
        taskType: 'Door Jammed',
        urgent: true,
        coordinates: { latitude: 13.0950, longitude: 80.2850 },
        distance: 0.9,
        required_skills: ['emergency response', 'mobility assistance'],
        emergency_features: {
            fall_detected: false,
            heart_rate_change: 12,
            inactivity_duration: 30,
            panic_text_score: 0.5,
            response_delay: 5
        },
        message: 'Front door is jammed and I cannot get out! Need help opening it!',
        priorityScore: 0.68,
        emergency_severity: 'MEDIUM'
    },
    {
        id: 5,
        location: 'Ground Floor, Lotus Apartments',
        elderName: 'Mr. Venkatesh',
        taskType: 'Water Pipe Burst',
        urgent: true,
        coordinates: { latitude: 13.0880, longitude: 80.2780 },
        distance: 1.1,
        required_skills: ['emergency response'],
        emergency_features: {
            fall_detected: false,
            heart_rate_change: 10,
            inactivity_duration: 15,
            panic_text_score: 0.4,
            response_delay: 6
        },
        message: 'Water pipe burst under sink! Kitchen is flooding! Need help turning off water!',
        priorityScore: 0.65,
        emergency_severity: 'MEDIUM'
    },
    {
        id: 6,
        location: '2nd Floor, Green Towers',
        elderName: 'Mrs. Annapurna',
        taskType: 'Stuck in Bathroom',
        urgent: true,
        coordinates: { latitude: 13.0950, longitude: 80.2850 },
        distance: 0.9,
        required_skills: ['mobility assistance'],
        emergency_features: {
            fall_detected: false,
            heart_rate_change: 8,
            inactivity_duration: 60,
            panic_text_score: 0.4,
            response_delay: 8
        },
        message: 'Stuck in bathroom, door won\'t open. Need help getting out.',
        priorityScore: 0.62,
        emergency_severity: 'MEDIUM'
    },
    {
        id: 7,
        location: 'Pharmacy Near Home, Anna Nagar',
        elderName: 'Mr. Venkatesh',
        taskType: 'Medicine Pickup',
        urgent: false,
        coordinates: { latitude: 13.0870, longitude: 80.2730 },
        distance: 0.3,
        required_skills: ['medicine delivery'],
        emergency_features: {
            fall_detected: false,
            heart_rate_change: 3,
            inactivity_duration: 90,
            panic_text_score: 0.1,
            response_delay: 12
        },
        message: 'Need to pick up my regular blood pressure medicine from pharmacy.',
        priorityScore: 0.45,
        emergency_severity: 'LOW'
    },
    {
        id: 8,
        location: 'Apartment 3B, Blue Towers',
        elderName: 'Mrs. Lakshmi',
        taskType: 'Light Cleaning Help',
        urgent: false,
        coordinates: { latitude: 13.0920, longitude: 80.2880 },
        distance: 1.1,
        required_skills: ['household help'],
        emergency_features: {
            fall_detected: false,
            heart_rate_change: 2,
            inactivity_duration: 120,
            panic_text_score: 0.0,
            response_delay: 15
        },
        message: 'Need help with light dusting and organizing kitchen shelves.',
        priorityScore: 0.38,
        emergency_severity: 'LOW'
    },
    {
        id: 9,
        location: 'Sunshine Apartments, T. Nagar',
        elderName: 'Mrs. Radha',
        taskType: 'Afternoon Tea Companion',
        urgent: false,
        coordinates: { latitude: 13.0420, longitude: 80.2320 },
        distance: 2.0,
        required_skills: ['companion care'],
        emergency_features: {
            fall_detected: false,
            heart_rate_change: 1,
            inactivity_duration: 180,
            panic_text_score: 0.0,
            response_delay: 20
        },
        message: 'Would love some company for afternoon tea and conversation.',
        priorityScore: 0.35,
        emergency_severity: 'LOW'
    },
    {
        id: 10,
        location: 'SBI Branch, Mount Road',
        elderName: 'Mr. Chandrasekhar',
        taskType: 'Bank Visit',
        urgent: false,
        coordinates: { latitude: 13.0700, longitude: 80.2500 },
        distance: 2.8,
        required_skills: ['medical escort'],
        emergency_features: {
            fall_detected: false,
            heart_rate_change: 0,
            inactivity_duration: 150,
            panic_text_score: 0.0,
            response_delay: 25
        },
        message: 'Need help going to bank to sign some documents.',
        priorityScore: 0.32,
        emergency_severity: 'LOW'
    },
    {
        id: 11,
        location: 'Residential Area, Adyar',
        elderName: 'Mrs. Padmavati',
        taskType: 'Phone Setup Help',
        urgent: false,
        coordinates: { latitude: 13.0150, longitude: 80.2150 },
        distance: 3.5,
        required_skills: ['tech support'],
        emergency_features: {
            fall_detected: false,
            heart_rate_change: 0,
            inactivity_duration: 200,
            panic_text_score: 0.0,
            response_delay: 30
        },
        message: 'Need help setting up new smartphone and installing apps.',
        priorityScore: 0.28,
        emergency_severity: 'LOW'
    }
];

export default function VolunteerMap() {
    const [navigationLocation, setNavigationLocation] = useState<string>('');
    const [volunteerLocation, setVolunteerLocation] = useState({ latitude: 13.0827, longitude: 80.2707 });
    const [isTrackingLocation, setIsTrackingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [priorityMarkers, setPriorityMarkers] = useState<any[]>([]);

    useEffect(() => {
        // Get the location from sessionStorage if it exists
        const storedLocation = sessionStorage.getItem('navigationLocation');
        if (storedLocation) {
            setNavigationLocation(storedLocation);
            // Clear the stored location after using it
            sessionStorage.removeItem('navigationLocation');
        }
    }, []);

    // Process requests using priority algorithm - sort by priority score
    useEffect(() => {
        try {
            // Sort requests by priority score (highest first)
            const sortedRequests = [...allRequestLocations].sort((a, b) => 
                (b.priorityScore || 0) - (a.priorityScore || 0)
            );
            
            // Convert to map markers with priority-based numbering
            const markers = sortedRequests.map((request, index) => ({
                id: index + 1, // Priority number (1 = highest priority)
                location: request.location,
                elderName: request.elderName,
                taskType: request.taskType,
                urgent: request.urgent,
                priorityScore: request.priorityScore,
                emergency_severity: request.emergency_severity,
                distance: request.distance,
                eta: Math.round(5 + (request.distance / 0.5 * 10)), // Simple ETA calculation
                coordinates: request.coordinates // Include coordinates directly
            }));
            setPriorityMarkers(markers);
        } catch (error) {
            console.error('Error processing requests:', error);
            // Fallback to basic markers
            const fallbackMarkers = allRequestLocations.map((request, index) => ({
                id: index + 1,
                location: request.location,
                elderName: request.elderName,
                taskType: request.taskType,
                urgent: request.urgent,
                coordinates: request.coordinates
            }));
            setPriorityMarkers(fallbackMarkers);
        }
    }, [volunteerLocation]);

    // Real-time location tracking
    useEffect(() => {
        // Get initial location
        getCurrentLocation()
            .then((location) => {
                setVolunteerLocation(location);
                setLocationError(null);
                setIsTrackingLocation(true);
                
                // Start watching location for real-time updates
                const stopWatching = watchLocation((newLocation) => {
                    setVolunteerLocation(newLocation);
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

        // Cleanup on unmount
        return () => {
            // Cleanup will be handled by the stopWatching function
        };
    }, []);

    return (
        <DutyProtection>
            <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {navigationLocation ? `Navigating to: ${navigationLocation}` : 'Service Area Map'}
                    </h2>
                    <div className="flex items-center gap-2">
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
                <div className="h-96 bg-slate-200 rounded-xl overflow-hidden relative shadow-inner">
                    <RealMap 
                        location={navigationLocation || 'Anna Nagar, Chennai'} 
                        markers={priorityMarkers}
                        volunteerLocation={volunteerLocation}
                        height="384px"
                    />
                </div>
                {navigationLocation && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                            <p className="text-amber-800 font-medium">Navigation Active</p>
                        </div>
                        <p className="text-sm text-amber-700 mt-1">
                            Following route to: {navigationLocation}
                        </p>
                    </div>
                )}
            </div>
            </div>
        </DutyProtection>
    );
}

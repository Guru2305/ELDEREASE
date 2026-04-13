// Priority-Based Request Ranking Algorithm

export interface VolunteerProfile {
    volunteer_id: string;
    skills: string[];
    trust_score: number;
    availability_status: number; // 0-1 scale
    location: {
        latitude: number;
        longitude: number;
    };
}

export interface EmergencyFeatures {
    fall_detected: boolean;
    heart_rate_change: number;
    inactivity_duration: number; // in minutes
    panic_text_score: number; // 0-1 scale
    response_delay: number; // in minutes
}

export interface RequestData {
    id: number;
    elderName: string;
    taskType: string;
    location: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    emergency_features?: EmergencyFeatures;
    message?: string;
    required_skills: string[];
    emergency_severity?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PriorityRequest extends RequestData {
    priority_score: number;
    distance: number;
    estimated_arrival_time: number;
    skill_match_score: number;
    distress_level?: 'Normal' | 'Distressed' | 'Panic';
    earnings?: string;
    eta?: number;
}

// Priority Score Calculation
export function calculatePriorityScore(
    request: RequestData,
    volunteer: VolunteerProfile,
    distance: number
): number {
    const emergency_severity = getEmergencySeverityValue(request.emergency_severity);
    const skill_match = calculateSkillMatch(request.required_skills, volunteer.skills);
    const volunteer_trust_score = volunteer.trust_score;
    const availability_status = volunteer.availability_status;
    const distance_score = calculateDistanceScore(distance);

    const priority_score = 
        (0.30 * emergency_severity) +
        (0.25 * skill_match) +
        (0.20 * volunteer_trust_score) +
        (0.15 * availability_status) +
        (0.10 * distance_score);

    return Math.round(priority_score * 100) / 100; // Round to 2 decimal places
}

// Helper function to get numeric value for emergency severity
function getEmergencySeverityValue(severity?: 'LOW' | 'MEDIUM' | 'HIGH'): number {
    switch(severity) {
        case 'HIGH': return 1.0;
        case 'MEDIUM': return 0.6;
        case 'LOW': return 0.3;
        default: return 0.5;
    }
}

// Emergency Severity Classification
export function classifyEmergencySeverity(features: EmergencyFeatures): 'LOW' | 'MEDIUM' | 'HIGH' {
    let severity_score = 0;

    // Fall detection (highest weight)
    if (features.fall_detected) severity_score += 40;

    // Heart rate change
    if (features.heart_rate_change > 30) severity_score += 30;
    else if (features.heart_rate_change > 15) severity_score += 20;
    else if (features.heart_rate_change > 5) severity_score += 10;

    // Inactivity duration
    if (features.inactivity_duration > 120) severity_score += 20; // > 2 hours
    else if (features.inactivity_duration > 60) severity_score += 15; // > 1 hour
    else if (features.inactivity_duration > 30) severity_score += 10; // > 30 minutes

    // Panic text score
    severity_score += features.panic_text_score * 10;

    // Response delay
    if (features.response_delay > 10) severity_score += 10;
    else if (features.response_delay > 5) severity_score += 5;

    if (severity_score >= 70) return 'HIGH';
    if (severity_score >= 40) return 'MEDIUM';
    return 'LOW';
}

// Skill Matching Algorithm
export function calculateSkillMatch(required_skills: string[], volunteer_skills: string[]): number {
    if (required_skills.length === 0) return 0.5; // Default score if no skills required

    const matching_skills = required_skills.filter(skill => 
        volunteer_skills.some(volunteer_skill => {
            const required = skill.toLowerCase().trim();
            const volunteer = volunteer_skill.toLowerCase().trim();
            
            // Exact match
            if (required === volunteer) return true;
            
            // Contains match (volunteer skill contains required skill)
            if (volunteer.includes(required) || required.includes(volunteer)) return true;
            
            // Skill synonym matching
            const skillSynonyms: Record<string, string[]> = {
                'medicine delivery': ['medicine', 'delivery', 'pharmacy', 'medication', 'medical'],
                'emergency response': ['emergency', 'first aid', 'urgent', 'help', 'rescue'],
                'companion care': ['companion', 'care', 'visit', 'company', 'social'],
                'grocery shopping': ['grocery', 'shopping', 'store', 'food', 'supplies'],
                'first aid': ['emergency', 'medical', 'help', 'aid', 'rescue'],
                'household help': ['household', 'cleaning', 'organizing', 'chores', 'home'],
                'medical escort': ['escort', 'medical', 'doctor', 'hospital', 'appointment', 'transport'],
                'mobility assistance': ['mobility', 'stuck', 'bathroom', 'door', 'accessibility', 'movement'],
                'tech support': ['tech', 'phone', 'computer', 'setup', 'digital', 'technology', 'smartphone']
            };
            
            // Check if volunteer skill matches any synonyms of required skill
            if (skillSynonyms[required]) {
                return skillSynonyms[required].some(synonym => 
                    volunteer.includes(synonym) || synonym.includes(volunteer)
                );
            }
            
            // Check if required skill matches any synonyms of volunteer skill
            for (const [key, synonyms] of Object.entries(skillSynonyms)) {
                if (synonyms.some(synonym => 
                    required.includes(synonym) || synonym.includes(required)
                ) && volunteer.includes(key)) {
                    return true;
                }
            }
            
            return false;
        })
    );

    return matching_skills.length / required_skills.length;
}

// Distance Score (inverse - closer is better)
export function calculateDistanceScore(distance: number): number {
    // Max distance considered is 10km, score decreases with distance
    const max_distance = 10;
    if (distance >= max_distance) return 0;
    return 1 - (distance / max_distance);
}

// Haversine Formula for Distance Calculation
export function calculateDistance(
    coord1: { latitude: number; longitude: number },
    coord2: { latitude: number; longitude: number }
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(coord2.latitude - coord1.latitude);
    const dLon = toRadians(coord2.longitude - coord1.longitude);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Get volunteer's current location using browser geolocation
export function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                reject(new Error(`Geolocation error: ${error.message}`));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

// Watch volunteer's location for real-time updates
export function watchLocation(callback: (location: { latitude: number; longitude: number }) => void): () => void {
    if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser.');
        return () => {};
    }

    const watchId = navigator.geolocation.watchPosition(
        (position) => {
            callback({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        },
        (error) => {
            console.error('Geolocation watch error:', error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000 // 5 seconds
        }
    );

    return () => {
        navigator.geolocation.clearWatch(watchId);
    };
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

// Volunteer Trust Score Calculation
export function calculateTrustScore(
    average_rating: number,
    completion_rate: number,
    response_time: number, // in minutes, lower is better
    reliability: number // 0-1 scale
): number {
    const response_time_score = Math.max(0, 1 - (response_time / 60)); // Normalize to 0-1 (60 min max)
    
    const trust_score = 
        (0.4 * average_rating) +
        (0.3 * completion_rate) +
        (0.2 * response_time_score) +
        (0.1 * reliability);

    return Math.round(trust_score * 100) / 100;
}

// Trust Level Badge
export function getTrustLevel(trust_score: number): 'Bronze' | 'Silver' | 'Gold' {
    if (trust_score >= 0.8) return 'Gold';
    if (trust_score >= 0.6) return 'Silver';
    return 'Bronze';
}

// Distress Detection from Messages
export function analyzeDistress(message: string): 'Normal' | 'Distressed' | 'Panic' {
    if (!message) return 'Normal';

    const panic_keywords = [
        'emergency', 'help', 'urgent', 'pain', 'fall', 'cannot', 'stuck',
        'dying', 'heart attack', 'stroke', 'bleeding', 'unconscious'
    ];
    
    const distress_keywords = [
        'uncomfortable', 'difficult', 'worried', 'scared', 'confused',
        'need assistance', 'please help', 'thank you', 'appreciate'
    ];

    const lower_message = message.toLowerCase();
    
    // Count keyword occurrences
    const panic_count = panic_keywords.filter(keyword => 
        lower_message.includes(keyword)
    ).length;
    
    const distress_count = distress_keywords.filter(keyword => 
        lower_message.includes(keyword)
    ).length;

    if (panic_count >= 2) return 'Panic';
    if (panic_count >= 1 || distress_count >= 2) return 'Distressed';
    if (distress_count >= 1) return 'Distressed';
    
    return 'Normal';
}

// Estimated Arrival Time (simple calculation based on distance)
export function calculateEstimatedArrivalTime(distance: number): number {
    const average_speed = 30; // km/h (urban driving speed)
    const preparation_time = 5; // minutes (time to prepare)
    
    return Math.round(preparation_time + (distance / average_speed * 60));
}

// Main function to process and rank requests
export function processAndRankRequests(
    requests: RequestData[],
    volunteer: VolunteerProfile,
    max_radius: number = 5 // km
): PriorityRequest[] {
    const processedRequests: PriorityRequest[] = [];

    for (const request of requests) {
        // Skip if no coordinates available
        if (!request.coordinates) continue;

        // Calculate distance
        const distance = calculateDistance(volunteer.location, request.coordinates);
        
        // Skip if outside radius
        if (distance > max_radius) continue;

        // Check if volunteer has required skills - ALL REQUESTS AVAILABLE (no skill filtering)
        // Focus on proximity and urgency instead of skill matching
        // This ensures volunteers see all nearby requests regardless of specific skills

        // Classify emergency severity if not provided
        const emergency_severity = request.emergency_severity || 
            (request.emergency_features ? classifyEmergencySeverity(request.emergency_features) : 'MEDIUM');

        // Analyze distress from message
        const distress_level = request.message ? analyzeDistress(request.message) : 'Normal';

        // Boost severity if distress detected
        let final_severity = emergency_severity;
        if (distress_level === 'Panic' && emergency_severity !== 'HIGH') {
            final_severity = 'HIGH';
        } else if (distress_level === 'Distressed' && emergency_severity === 'LOW') {
            final_severity = 'MEDIUM';
        }

        // Calculate scores
        const skill_match_score = calculateSkillMatch(request.required_skills || [], volunteer.skills);
        const priority_score = calculatePriorityScore(
            { ...request, emergency_severity: final_severity },
            volunteer,
            distance
        );
        const estimated_arrival_time = calculateEstimatedArrivalTime(distance);

        processedRequests.push({
            ...request,
            emergency_severity: final_severity,
            priority_score,
            distance,
            estimated_arrival_time,
            skill_match_score,
            distress_level
        });
    }

    // Sort by priority score (highest first)
    return processedRequests.sort((a, b) => b.priority_score - a.priority_score);
}

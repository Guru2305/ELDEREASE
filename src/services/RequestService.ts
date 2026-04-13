// Shared request service for elder-volunteer communication
export interface ServiceRequest {
    id: string;
    elderName: string;
    taskType: string;
    location: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    urgent: boolean;
    priorityScore?: number;
    emergency_severity?: 'HIGH' | 'MEDIUM' | 'LOW';
    message: string;
    timestamp: number;
    status: 'pending' | 'accepted' | 'completed';
    volunteerId?: string;
    acceptedVolunteer?: string; // Added for admin tracking
    acceptedAt?: number; // Added for admin tracking
}

class RequestService {
    private static instance: RequestService;
    private requests: ServiceRequest[] = [];
    private listeners: ((requests: ServiceRequest[]) => void)[] = [];

    private constructor() {}

    static getInstance(): RequestService {
        if (!RequestService.instance) {
            RequestService.instance = new RequestService();
        }
        return RequestService.instance;
    }

    // Add new request from elder
    addRequest(request: Omit<ServiceRequest, 'id' | 'timestamp' | 'status'>): ServiceRequest {
        const newRequest: ServiceRequest = {
            ...request,
            id: Date.now().toString(),
            timestamp: Date.now(),
            status: 'pending',
            priorityScore: this.calculatePriorityScore(request),
            emergency_severity: this.determineSeverity(request)
        };

        this.requests.push(newRequest);
        this.notifyListeners();
        
        // Store in localStorage for persistence
        localStorage.setItem('elderRequests', JSON.stringify(this.requests));
        
        return newRequest;
    }

    // Get all pending requests
    getPendingRequests(): ServiceRequest[] {
        return this.requests.filter(req => req.status === 'pending');
    }

    // Accept request by volunteer
    acceptRequest(requestId: string, volunteerId: string, volunteerName?: string): boolean {
        const request = this.requests.find(req => req.id === requestId);
        if (request && request.status === 'pending') {
            request.status = 'accepted';
            request.volunteerId = volunteerId;
            request.acceptedVolunteer = volunteerName || `Volunteer ${volunteerId}`;
            request.acceptedAt = Date.now();
            this.notifyListeners();
            localStorage.setItem('elderRequests', JSON.stringify(this.requests));
            return true;
        }
        return false;
    }

    // Complete request
    completeRequest(requestId: string): boolean {
        const request = this.requests.find(req => req.id === requestId);
        if (request) {
            request.status = 'completed';
            this.notifyListeners();
            localStorage.setItem('elderRequests', JSON.stringify(this.requests));
            return true;
        }
        return false;
    }

    // Subscribe to request updates
    subscribe(listener: (requests: ServiceRequest[]) => void): () => void {
        this.listeners.push(listener);
        listener(this.requests);
        
        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    // Notify all listeners
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.requests));
    }

    // Calculate priority score based on proximity and urgency
    private calculatePriorityScore(request: any): number {
        let score = 0.5; // Base score

        if (request.urgent) score += 0.3;
        if (request.emergency_severity === 'HIGH') score += 0.4;
        else if (request.emergency_severity === 'MEDIUM') score += 0.2;

        return Math.min(score, 1.0);
    }

    // Determine emergency severity
    private determineSeverity(request: any): 'HIGH' | 'MEDIUM' | 'LOW' {
        if (request.urgent || request.taskType.includes('Emergency') || request.taskType.includes('Fall')) {
            return 'HIGH';
        }
        if (request.taskType.includes('Stuck') || request.taskType.includes('Leak')) {
            return 'MEDIUM';
        }
        return 'LOW';
    }

    // Load requests from localStorage
    loadStoredRequests(): void {
        try {
            const stored = localStorage.getItem('elderRequests');
            if (stored) {
                this.requests = JSON.parse(stored);
                this.notifyListeners();
            }
        } catch (error) {
            console.error('Failed to load stored requests:', error);
        }
    }
}

export default RequestService.getInstance();

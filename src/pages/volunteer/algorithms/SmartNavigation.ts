// Smart Navigation System

export interface NavigationLocation {
    latitude: number;
    longitude: number;
    address: string;
}

export interface NavigationOptions {
    mode: 'driving' | 'walking' | 'transit';
    avoid_tolls?: boolean;
    avoid_highways?: boolean;
}

// Open Google Maps Navigation
export function openGoogleMapsNavigation(location: NavigationLocation, options?: NavigationOptions): void {
    const { latitude, longitude, address } = location;
    
    let url = `https://www.google.com/maps/dir/?api=1`;
    
    // Add destination
    url += `&destination=${latitude},${longitude}`;
    
    // Add travel mode
    if (options?.mode) {
        url += `&travelmode=${options.mode}`;
    }
    
    // Add avoid options
    if (options?.avoid_tolls) {
        url += `&avoid=tolls`;
    }
    
    if (options?.avoid_highways) {
        url += `&avoid=highways`;
    }
    
    // Open in new window
    window.open(url, '_blank');
}

// Open OpenStreetMap Navigation (via OSMAnd or similar)
export function openOpenStreetMapNavigation(location: NavigationLocation, options?: NavigationOptions): void {
    const { latitude, longitude } = location;
    
    let url = `https://www.openstreetmap.org/directions?from=&to=${latitude},${longitude}`;
    
    // Add travel mode parameter
    if (options?.mode) {
        const modeMap = {
            'driving': 'car',
            'walking': 'foot',
            'transit': 'public_transport'
        };
        url += `&engine=${modeMap[options.mode]}`;
    }
    
    window.open(url, '_blank');
}

// Open Waze Navigation
export function openWazeNavigation(location: NavigationLocation): void {
    const { latitude, longitude } = location;
    
    const url = `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    
    window.open(url, '_blank');
}

// Open Apple Maps (for iOS devices)
export function openAppleMapsNavigation(location: NavigationLocation, options?: NavigationOptions): void {
    const { latitude, longitude, address } = location;
    
    let url = `maps://?q=${encodeURIComponent(address)}`;
    
    // For directions, use:
    url = `maps://?daddr=${latitude},${longitude}`;
    
    // Add transport type
    if (options?.mode) {
        const transportMap = {
            'driving': 'd',
            'walking': 'w',
            'transit': 'r'
        };
        url += `&t=${transportMap[options.mode]}`;
    }
    
    window.open(url, '_blank');
}

// Detect user's preferred navigation app
export function detectPreferredNavigationApp(): 'google' | 'waze' | 'apple' | 'osm' {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Detect iOS devices
    if (/iphone|ipad|ipod/.test(userAgent)) {
        return 'apple';
    }
    
    // Detect Android devices
    if (/android/.test(userAgent)) {
        // Check if Waze is likely installed (most common navigation app on Android)
        return 'waze';
    }
    
    // Default to Google Maps for desktop/other
    return 'google';
}

// Smart navigation that opens the best app for the device
export function openSmartNavigation(location: NavigationLocation, options?: NavigationOptions): void {
    const preferredApp = detectPreferredNavigationApp();
    
    switch (preferredApp) {
        case 'google':
            openGoogleMapsNavigation(location, options);
            break;
        case 'waze':
            openWazeNavigation(location);
            break;
        case 'apple':
            openAppleMapsNavigation(location, options);
            break;
        case 'osm':
            openOpenStreetMapNavigation(location, options);
            break;
        default:
            openGoogleMapsNavigation(location, options);
    }
}

// Generate navigation URL for embedding in iframe
export function getNavigationEmbedUrl(location: NavigationLocation, provider: 'google' | 'osm' = 'google'): string {
    const { latitude, longitude } = location;
    
    if (provider === 'google') {
        return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${latitude},${longitude}`;
    } else {
        return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
    }
}

// Calculate estimated time of arrival based on current traffic (simplified)
export function calculateETA(distance: number, mode: 'driving' | 'walking' | 'transit'): number {
    const speeds = {
        driving: 30, // km/h average urban speed
        walking: 5,  // km/h walking speed
        transit: 25  // km/h average transit speed
    };
    
    const base_time = (distance / speeds[mode]) * 60; // Convert to minutes
    
    // Add buffer time for different modes
    const buffer = {
        driving: 5,  // 5 minutes for parking
        walking: 0,  // No buffer needed
        transit: 10  // 10 minutes for waiting/transfers
    };
    
    return Math.round(base_time + buffer[mode]);
}

// Get navigation instructions based on distance and mode
export function getNavigationInstructions(distance: number, mode: 'driving' | 'walking' | 'transit'): string[] {
    const instructions = [];
    
    if (mode === 'driving') {
        instructions.push('Start your vehicle and GPS navigation');
        if (distance > 5) {
            instructions.push('Use highway routes for faster travel');
        } else {
            instructions.push('Use local roads for shorter distance');
        }
        instructions.push('Look for parking near the destination');
        instructions.push('Walk to the exact location from parking');
    } else if (mode === 'walking') {
        instructions.push('Start walking towards the destination');
        instructions.push('Use pedestrian paths and sidewalks');
        instructions.push('Be careful at road crossings');
        instructions.push('Follow the navigation app instructions');
    } else if (mode === 'transit') {
        instructions.push('Walk to the nearest transit stop');
        instructions.push('Check transit schedules and routes');
        instructions.push('Board the correct bus/train');
        instructions.push('Get off at the destination stop');
        instructions.push('Walk to the exact location');
    }
    
    return instructions;
}

// Safety reminders for volunteers
export function getSafetyReminders(emergencyType: string, timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'): string[] {
    const reminders = [
        'Keep your phone charged and accessible',
        'Share your location with your coordinator',
        'Carry identification and emergency contacts'
    ];
    
    // Time-specific reminders
    if (timeOfDay === 'night' || timeOfDay === 'evening') {
        reminders.push('Use well-lit routes');
        reminders.push('Be aware of your surroundings');
        reminders.push('Consider carrying a flashlight');
    }
    
    // Emergency-specific reminders
    if (emergencyType.toLowerCase().includes('emergency') || emergencyType.toLowerCase().includes('urgent')) {
        reminders.push('Follow traffic laws even in emergencies');
        reminders.push('Use hazard lights if necessary');
        reminders.push('Call emergency services if situation worsens');
    }
    
    return reminders;
}

// Check if navigation is available (GPS, internet)
export function checkNavigationAvailability(): { available: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check if geolocation is available
    if (!navigator.geolocation) {
        issues.push('GPS not available on this device');
    }
    
    // Check if online
    if (!navigator.onLine) {
        issues.push('No internet connection - offline maps may be limited');
    }
    
    return {
        available: issues.length === 0,
        issues
    };
}

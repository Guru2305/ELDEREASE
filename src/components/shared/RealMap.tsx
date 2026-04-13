import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface RealMapProps {
    location?: string;
    markers?: Array<{
        id: number;
        location: string;
        elderName: string;
        taskType: string;
        urgent?: boolean;
        priorityScore?: number;
        emergency_severity?: string;
        distance?: number;
        eta?: number;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    }>;
    volunteerLocation?: {
        latitude: number;
        longitude: number;
    };
    height?: string;
}

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function RealMap({ location, markers = [], volunteerLocation, height = '400px' }: RealMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    // Chennai coordinates (default center)
    const defaultCenter: [number, number] = [13.0827, 80.2707];

    // Geocoding function to convert address to coordinates
    const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
        try {
            // Using Nominatim OpenStreetMap geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, Chennai, India`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    };

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map only once
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView(volunteerLocation ? [volunteerLocation.latitude, volunteerLocation.longitude] : defaultCenter, 13);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);
        }

        return () => {
            // Cleanup map on component unmount
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Clear existing markers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add volunteer location marker
        if (volunteerLocation) {
            const volunteerIcon = L.divIcon({
                className: 'custom-marker',
                html: `
                    <div style="
                        background-color: #4ade80;
                        color: white;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: 16px;
                        border: 3px solid white;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                        z-index: 1000;
                    ">
                        📍
                    </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
            });

            L.marker([volunteerLocation.latitude, volunteerLocation.longitude], { icon: volunteerIcon })
                .addTo(map)
                .bindPopup(`
                    <div style="min-width: 200px;">
                        <h4 style="margin: 0 0 8px 0; font-weight: bold;">Your Location</h4>
                        <p style="margin: 0; font-size: 12px; color: #666;">
                            📍 ${volunteerLocation.latitude.toFixed(4)}, ${volunteerLocation.longitude.toFixed(4)}
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #666;">
                            This is your current location
                        </p>
                    </div>
                `);
        }

        // Add request markers with priority-based styling
        const addMarkers = async () => {
            for (const marker of markers) {
                // Use coordinates directly if available, otherwise try geocoding
                let coords: [number, number] | null = null;
                
                if (marker.coordinates) {
                    coords = [marker.coordinates.latitude, marker.coordinates.longitude];
                } else {
                    // Fallback to geocoding if no coordinates
                    coords = await geocodeAddress(marker.location);
                }
                
                if (coords) {
                    // Determine marker color based on priority and severity
                    let markerColor = '#3b82f6'; // Default blue
                    let markerSize = 30;
                    let zIndex = 500;
                    
                    if (marker.emergency_severity === 'HIGH') {
                        markerColor = '#ef4444'; // Red for high priority
                        markerSize = 35;
                        zIndex = 1000;
                    } else if (marker.emergency_severity === 'MEDIUM') {
                        markerColor = '#f59e0b'; // Amber for medium priority
                        markerSize = 32;
                        zIndex = 750;
                    } else if (marker.priorityScore && marker.priorityScore > 0.7) {
                        markerColor = '#8b5cf6'; // Purple for high score
                        markerSize = 32;
                        zIndex = 750;
                    }
                    
                    // Special styling for top 3 priorities
                    if (marker.id <= 3) {
                        markerSize = 40;
                        zIndex = 1500;
                    }

                    const icon = L.divIcon({
                        className: 'custom-marker',
                        html: `
                            <div style="
                                background-color: ${markerColor};
                                color: white;
                                border-radius: 50%;
                                width: ${markerSize}px;
                                height: ${markerSize}px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                font-size: ${marker.id <= 3 ? '14px' : '12px'};
                                border: 3px solid white;
                                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                                z-index: ${zIndex};
                                position: relative;
                            ">
                                ${marker.id}
                                ${marker.id <= 3 ? '<div style="position: absolute; top: -8px; right: -8px; background: #fbbf24; color: #000; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center;">⭐</div>' : ''}
                            </div>
                        `,
                        iconSize: [markerSize, markerSize],
                        iconAnchor: [markerSize/2, markerSize/2],
                    });

                    L.marker(coords, { icon })
                        .addTo(map)
                        .bindPopup(`
                            <div style="min-width: 220px;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                    <div style="background: ${markerColor}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                                        Priority #${marker.id}
                                    </div>
                                    ${marker.id <= 3 ? '<span style="color: #fbbf24;">⭐ Top Priority</span>' : ''}
                                </div>
                                <h4 style="margin: 0 0 8px 0; font-weight: bold;">${marker.elderName}</h4>
                                <p style="margin: 0 0 4px 0; font-size: 14px;"><strong>Task:</strong> ${marker.taskType}</p>
                                <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;"><strong>Location:</strong> ${marker.location}</p>
                                ${marker.priorityScore ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;"><strong>Priority Score:</strong> ${Math.round(marker.priorityScore * 100)}%</p>` : ''}
                                ${marker.distance ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;"><strong>Distance:</strong> ${marker.distance} km</p>` : ''}
                                ${marker.eta ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;"><strong>ETA:</strong> ${marker.eta} min</p>` : ''}
                                ${marker.urgent ? '<p style="margin: 0; color: #ef4444; font-weight: bold;">⚠️ URGENT</p>' : ''}
                            </div>
                        `);

                    // Center map on the highest priority marker
                    if (marker.id === 1) {
                        map.setView(coords, 14);
                    }
                }
            }

            // If no markers but location is provided, center on that location
            if (markers.length === 0 && location) {
                const coords = await geocodeAddress(location);
                if (coords) {
                    map.setView(coords, 15);
                    
                    // Add a single marker for the navigation location
                    const icon = L.divIcon({
                        className: 'custom-marker',
                        html: `
                            <div style="
                                background-color: #10b981;
                                color: white;
                                border-radius: 50%;
                                width: 30px;
                                height: 30px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                font-size: 12px;
                                border: 2px solid white;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                            ">
                                📍
                            </div>
                        `,
                        iconSize: [30, 30],
                        iconAnchor: [15, 15],
                    });

                    L.marker(coords, { icon })
                        .addTo(map)
                        .bindPopup(`<strong>Navigating to:</strong><br>${location}`);
                }
            }
        };

        addMarkers();
    }, [location, markers, volunteerLocation]);

    return (
        <div 
            ref={mapRef} 
            style={{ 
                height, 
                width: '100%', 
                borderRadius: '0.5rem',
                position: 'relative',
                zIndex: 1
            }}
            className="border border-slate-200"
        />
    );
}

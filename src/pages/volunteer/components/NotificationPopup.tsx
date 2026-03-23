import React, { useState, useEffect } from 'react';
import { X, Bell, User, AlertTriangle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationPopupProps {
    isVisible: boolean;
    onClose: () => void;
    elderName: string;
    taskType: string;
    taskId?: number;
    location?: string;
    urgent?: boolean;
    message?: string;
    emergency_severity?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export default function NotificationPopup({ isVisible, onClose, elderName, taskType, taskId, location, urgent, message, emergency_severity }: NotificationPopupProps) {
    const [playSound, setPlaySound] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isVisible) {
            // Play notification sound using Web Audio API
            const playNotificationSound = () => {
                try {
                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                    
                    // Create a more complex ringing sound
                    const now = audioContext.currentTime;
                    
                    // Create multiple oscillators for richer sound
                    const oscillator1 = audioContext.createOscillator();
                    const oscillator2 = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    // Connect oscillators to gain
                    oscillator1.connect(gainNode);
                    oscillator2.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    // Create ringing effect with two frequencies
                    oscillator1.frequency.value = 800; // Primary tone
                    oscillator2.frequency.value = 1200; // Harmonic tone
                    oscillator1.type = 'sine';
                    oscillator2.type = 'sine';
                    
                    // Create envelope for ringing effect
                    gainNode.gain.value = 0;
                    
                    // Start the oscillators
                    oscillator1.start(now);
                    oscillator2.start(now);
                    
                    // Create ringing pattern
                    const ringDuration = 0.8; // 0.8 seconds of ringing
                    const ringInterval = 0.1; // Ring on/off pattern
                    let elapsed = 0;
                    
                    const ringPattern = () => {
                        if (elapsed < ringDuration) {
                            // Ring on
                            gainNode.gain.value = 0.15;
                            setTimeout(() => {
                                // Ring off
                                gainNode.gain.value = 0;
                                elapsed += ringInterval;
                                if (elapsed < ringDuration) {
                                    setTimeout(ringPattern, ringInterval * 1000);
                                }
                            }, ringInterval * 500);
                        }
                    };
                    
                    // Start the ringing pattern
                    ringPattern();
                    
                    // Stop oscillators after ringing
                    setTimeout(() => {
                        oscillator1.stop();
                        oscillator2.stop();
                    }, ringDuration * 1000);
                    
                    setPlaySound(true);
                } catch (error) {
                    console.log('Error playing notification sound:', error);
                    // Fallback: try creating a simple beep
                    const audio = new Audio('data:audio/wav;base64,UklGRi9AAABXRU9Qm');
                    audio.volume = 0.1;
                    audio.play().catch(() => {
                        console.log('Fallback audio also failed');
                    });
                    setPlaySound(true);
                }
            };
            
            playNotificationSound();
            
            // Auto-close after 5 seconds
            const timer = setTimeout(() => {
                onClose();
                setPlaySound(false);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const handleViewDetails = () => {
        onClose();
        if (taskId) {
            navigate(`/volunteer/requests#task-${taskId}`);
        } else {
            navigate('/volunteer/requests');
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                {/* Header with Icon */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            urgent ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                            <Bell className={`w-6 h-6 animate-pulse ${
                                urgent ? 'text-red-600' : 'text-blue-600'
                            }`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">
                                {urgent ? '🚨 Emergency Request!' : 'New Service Request!'}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {emergency_severity === 'HIGH' ? 'High Priority' : 
                                 emergency_severity === 'MEDIUM' ? 'Medium Priority' : 'Normal Priority'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                
                {/* Elder Information */}
                <div className={`${urgent ? 'bg-red-50' : 'bg-blue-50'} rounded-xl p-6 mb-6`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            urgent ? 'bg-red-200' : 'bg-blue-200'
                        }`}>
                            <User className={`w-8 h-8 ${urgent ? 'text-red-700' : 'text-blue-700'}`} />
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-lg font-semibold mb-1 ${
                                urgent ? 'text-red-800' : 'text-blue-800'
                            }`}>{elderName}</h4>
                            <p className={urgent ? 'text-red-600' : 'text-blue-600'}>needs help with</p>
                            <p className={`text-xl font-bold ${
                                urgent ? 'text-red-900' : 'text-blue-900'
                            }`}>{taskType}</p>
                        </div>
                    </div>
                    
                    {/* Location */}
                    {location && (
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin className={`w-4 h-4 ${urgent ? 'text-red-600' : 'text-blue-600'}`} />
                            <p className={`text-sm ${urgent ? 'text-red-700' : 'text-blue-700'}`}>{location}</p>
                        </div>
                    )}
                    
                    {/* Message */}
                    {message && (
                        <div className={`p-3 rounded-lg ${
                            urgent ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                            <p className={`text-sm ${urgent ? 'text-red-800' : 'text-blue-800'}`}>"{message}"</p>
                        </div>
                    )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={handleViewDetails}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        View Details
                    </button>
                </div>
                
                {/* Sound Indicator */}
                {playSound && (
                    <div className="absolute top-4 right-4 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                )}
            </div>
        </div>
    );
}

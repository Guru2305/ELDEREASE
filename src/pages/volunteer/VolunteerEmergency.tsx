import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Phone, Navigation, Clock, Shield } from 'lucide-react';
import DutyProtection from './components/DutyProtection';

export default function VolunteerEmergency() {
    const navigate = useNavigate();
    const emergencyContacts = [
        {
            name: 'Emergency Services',
            number: '108',
            type: 'medical',
            description: 'Ambulance and Medical Emergency'
        },
        {
            name: 'Police',
            number: '100',
            type: 'police',
            description: 'Police Assistance'
        },
        {
            name: 'Fire Department',
            number: '101',
            type: 'fire',
            description: 'Fire and Rescue Services'
        },
        {
            name: 'ElderAssist Support',
            number: '1800-ELDER-01',
            type: 'support',
            description: '24/7 Volunteer Support Hotline'
        }
    ];

    const activeEmergencies = [
        {
            id: 1,
            type: 'medical',
            title: 'Medical Emergency - Fall',
            location: '12th Cross Street, Anna Nagar',
            distance: '0.8 km',
            time: '2 mins ago',
            severity: 'high',
            assigned: false
        },
        {
            id: 2,
            type: 'sos',
            title: 'SOS Alert - No Response',
            location: 'Main Road, Near Temple',
            distance: '0.2 km',
            time: '5 mins ago',
            severity: 'critical',
            assigned: false
        }
    ];

    const handleNavigate = (location: string) => {
        // Store the location in sessionStorage to pass it to the map page
        sessionStorage.setItem('navigationLocation', location);
        navigate('/volunteer/map');
    };

    const getSeverityColor = (severity: string) => {
        switch(severity) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getContactColor = (type: string) => {
        switch(type) {
            case 'medical': return 'bg-red-50 text-red-600 border-red-200';
            case 'police': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'fire': return 'bg-orange-50 text-orange-600 border-orange-200';
            default: return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        }
    };

    return (
        <DutyProtection>
            <div className="space-y-6">
            {/* Emergency Alert Banner */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
                    <div>
                        <h3 className="font-semibold text-red-800">Emergency Mode Active</h3>
                        <p className="text-sm text-red-600">You are available for emergency assistance requests</p>
                    </div>
                </div>
            </div>

            {/* Active Emergencies */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Active Emergency Requests</h2>
                
                {activeEmergencies.length > 0 ? (
                    <div className="space-y-4">
                        {activeEmergencies.map((emergency) => (
                            <div key={emergency.id} className="border border-red-200 bg-red-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-red-800 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                                            {emergency.title}
                                        </h3>
                                        <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" />
                                            {emergency.time}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(emergency.severity)}`}>
                                        {emergency.severity.toUpperCase()}
                                    </span>
                                </div>

                                <div className="text-sm text-slate-600 space-y-1 mb-4">
                                    <p className="flex items-center gap-2">
                                        <Navigation className="w-4 h-4" />
                                        {emergency.location} ({emergency.distance} away)
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleNavigate(emergency.location)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm transition-colors"
                                    >
                                        RUSH TO HELP
                                    </button>
                                    <button className="flex-1 bg-white text-red-600 border border-red-200 py-2 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-500">No active emergency requests</p>
                    </div>
                )}
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Emergency Contacts</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {emergencyContacts.map((contact, index) => (
                        <div key={index} className={`border rounded-lg p-4 ${getContactColor(contact.type)}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-slate-800">{contact.name}</h3>
                                    <p className="text-sm text-slate-600 mt-1">{contact.description}</p>
                                </div>
                                <button className="bg-white text-slate-800 px-3 py-1 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    {contact.number}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </DutyProtection>
    );
}

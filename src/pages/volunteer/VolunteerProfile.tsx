import { useState } from 'react';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Award, 
    Clock, 
    Edit,
    Zap,
    Moon,
    AlertTriangle,
    Target,
    Star,
    DollarSign
} from 'lucide-react';

export default function VolunteerProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<any>(null);
    const [editFormData, setEditFormData] = useState({
        name: 'Reenish',
        email: 'ruban.8@example.com',
        phone: '+91 98765 43210',
        location: 'Anna Nagar, Chennai'
    });

    // This would normally come from backend, but for demo we'll manage it locally
    const [profileData, setProfileData] = useState({
        name: 'Reenish',
        email: 'ruban.8@example.com',
        phone: '+91 98765 43210',
        location: 'Anna Nagar, Chennai',
        joinDate: 'January 2024',
        totalTasks: 42,
        totalEarnings: 2850,
        rating: 4.8,
        verificationStatus: 'verified'
    });

    const achievements = [
        {
            title: 'Quick Responder',
            description: 'Completed 10+ tasks within 30 minutes',
            icon: Zap,
            earned: true
        },
        {
            title: 'Night Owl',
            description: 'Completed 5+ tasks after 10 PM',
            icon: Moon,
            earned: true
        },
        {
            title: 'Emergency Hero',
            description: 'Responded to 5+ emergency requests',
            icon: AlertTriangle,
            earned: false
        },
        {
            title: '100 Tasks Milestone',
            description: 'Complete 100 total tasks',
            icon: Target,
            earned: false
        }
    ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star 
                key={i} 
                className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`}
            />
        ));
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditFormData({
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            location: profileData.location
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        setIsEditing(false);
        setPendingChanges(editFormData);
        setShowSuccessMessage(true);
        // Hide success message after 5 seconds
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 5000);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    // Simulate admin approval (in real app, this would come from backend/websocket)
    const simulateAdminApproval = () => {
        if (pendingChanges) {
            setProfileData(prev => ({
                ...prev,
                ...pendingChanges
            }));
            setPendingChanges(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Pending Changes Notification */}
            {pendingChanges && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-800">Changes Pending Admin Approval</h3>
                                <p className="text-sm text-amber-700">Your profile changes are waiting for admin approval.</p>
                            </div>
                        </div>
                        <button
                            onClick={simulateAdminApproval}
                            className="px-3 py-1 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            Simulate Admin Approval
                        </button>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {showSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-emerald-800">Changes Submitted Successfully!</h3>
                        <p className="text-sm text-emerald-700">Your profile changes have been sent to admin. Soon admin will accept it.</p>
                    </div>
                    <button 
                        onClick={() => setShowSuccessMessage(false)}
                        className="text-emerald-600 hover:text-emerald-800"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-800">Profile Information</h2>
                    {!isEditing && (
                        <button 
                            onClick={handleEditClick}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={editFormData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editFormData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={editFormData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={editFormData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-slate-800">{profileData.name}</h3>
                                    {profileData.verificationStatus === 'verified' && (
                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                            ✓ Verified
                                        </span>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2 text-sm text-slate-600">
                                        <Mail className="w-4 h-4" />
                                        {profileData.email}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone className="w-4 h-4" />
                                        {profileData.phone}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin className="w-4 h-4" />
                                        {profileData.location}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm text-slate-600">
                                        <Clock className="w-4 h-4" />
                                        Member since {profileData.joinDate}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Total Tasks</p>
                            <p className="text-2xl font-bold text-slate-800">{profileData.totalTasks}</p>
                        </div>
                        <Award className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Total Earnings</p>
                            <p className="text-2xl font-bold text-slate-800">₹{profileData.totalEarnings}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-emerald-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Average Rating</p>
                            <p className="text-2xl font-bold text-slate-800">{profileData.rating}</p>
                        </div>
                        <div className="flex items-center">
                            {renderStars(Math.round(profileData.rating))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Achievements</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                        <div 
                            key={index} 
                            className={`p-4 rounded-lg border ${
                                achievement.earned 
                                    ? 'bg-amber-50 border-amber-200' 
                                    : 'bg-slate-50 border-slate-200 opacity-60'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <achievement.icon 
                                    className={`w-8 h-8 ${achievement.earned ? 'text-amber-600' : 'text-slate-400'}`}
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800">{achievement.title}</h3>
                                    <p className="text-sm text-slate-600">{achievement.description}</p>
                                </div>
                                {achievement.earned && (
                                    <span className="text-amber-600">
                                        <Award className="w-5 h-5" />
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

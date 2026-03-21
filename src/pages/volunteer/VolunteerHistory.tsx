import { CheckCircle, Clock, DollarSign, Calendar, MapPin } from 'lucide-react';

export default function VolunteerHistory() {
    const completedTasks = [
        {
            id: 1,
            title: 'Medicine Delivery',
            location: '12th Cross Street, Anna Nagar',
            date: '2024-02-14',
            earnings: '₹50',
            duration: '45 mins',
            rating: 5
        },
        {
            id: 2,
            title: 'Grocery Run',
            location: 'Green Garden Apartments',
            date: '2024-02-13',
            earnings: '₹80',
            duration: '1 hour 20 mins',
            rating: 4
        },
        {
            id: 3,
            title: 'Emergency Assistance',
            location: 'Main Road, Near Temple',
            date: '2024-02-12',
            earnings: 'Volunteer',
            duration: '30 mins',
            rating: 5
        },
        {
            id: 4,
            title: 'Companionship Visit',
            location: 'Sunshine Senior Living',
            date: '2024-02-11',
            earnings: '₹40',
            duration: '2 hours',
            rating: 5
        }
    ];

    const totalEarnings = completedTasks.reduce((sum, task) => {
        if (task.earnings !== 'Volunteer') {
            return sum + parseInt(task.earnings.replace('₹', '').replace(',', ''));
        }
        return sum;
    }, 0);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`text-sm ${i < rating ? 'text-yellow-500' : 'text-slate-300'}`}>
                ★
            </span>
        ));
    };

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Total Tasks</p>
                            <p className="text-2xl font-bold text-slate-800">{completedTasks.length}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Total Earnings</p>
                            <p className="text-2xl font-bold text-slate-800">₹{totalEarnings}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-emerald-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Avg Rating</p>
                            <p className="text-2xl font-bold text-slate-800">4.8</p>
                        </div>
                        <span className="text-2xl text-yellow-500">★</span>
                    </div>
                </div>
            </div>

            {/* Task History */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Task History</h2>
                
                <div className="space-y-4">
                    {completedTasks.map((task) => (
                        <div key={task.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-800">{task.title}</h3>
                                <span className="font-bold text-emerald-600">{task.earnings}</span>
                            </div>

                            <div className="text-sm text-slate-500 space-y-1 mb-3">
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {task.location}
                                </p>
                                <div className="flex items-center gap-4">
                                    <p className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {task.date}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {task.duration}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600">Rating:</span>
                                    {renderStars(task.rating)}
                                </div>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

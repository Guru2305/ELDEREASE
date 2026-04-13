import { useState } from 'react';
import { MapPin, Phone, CheckCircle, XCircle, Star, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Task {
  id: string;
  elderName: string;
  serviceType: string;
  address: string;
  distance: string;
  description: string;
  status: 'available' | 'accepted' | 'in_progress' | 'completed';
  phone: string;
}

export default function VolunteerDashboard() {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      elderName: 'Rajam',
      serviceType: 'groceries',
      address: '23, 5th Street, KK Nagar',
      distance: '0.8 km',
      description: 'Need vegetables and rice from local store',
      status: 'available',
      phone: '+91 98765 43210',
    },
    {
      id: '2',
      elderName: 'Venkatesh',
      serviceType: 'medicines',
      address: '15, Krishna Street, KK Nagar',
      distance: '1.2 km',
      description: 'Pick up prescription from Apollo Pharmacy',
      status: 'available',
      phone: '+91 98765 43211',
    },
    {
      id: '3',
      elderName: 'Lakshmi',
      serviceType: 'transport',
      address: '42, Lakshmi Nagar, KK Nagar',
      distance: '0.5 km',
      description: 'Need ride to nearby temple',
      status: 'accepted',
      phone: '+91 98765 43212',
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleAcceptTask = (taskId: string) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, status: 'accepted' as const } : task))
    );
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, status: 'completed' as const } : task))
    );
    setSelectedTask(null);
  };

  const availableTasks = tasks.filter((t) => t.status === 'available');
  const myTasks = tasks.filter((t) => t.status === 'accepted' || t.status === 'in_progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'accepted':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('volunteerDashboard')}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Star size={24} className="text-yellow-500" fill="currentColor" />
              <span className="text-xl font-semibold">4.8 {t('rating')}</span>
            </div>
            <div className="text-xl">
              <span className="font-semibold">{completedTasks.length}</span> tasks completed
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('nearbyRequests')}</h2>
            <div className="space-y-4">
              {availableTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{task.elderName}</h3>
                      <p className="text-lg text-gray-600 capitalize">{t(task.serviceType)}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {t(task.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin size={18} />
                    <span className="text-base">{task.distance}</span>
                  </div>
                  <p className="text-base text-gray-700">{task.description}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptTask(task.id);
                    }}
                    className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white rounded-xl p-3 text-lg font-bold transition-all"
                  >
                    {t('acceptRequest')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Active Tasks</h2>
            <div className="space-y-4">
              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{task.elderName}</h3>
                      <p className="text-lg text-gray-600 capitalize">{t(task.serviceType)}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {t(task.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin size={18} />
                    <span className="text-base">{task.address}</span>
                  </div>
                  <a
                    href={`tel:${task.phone}`}
                    className="flex items-center gap-2 text-blue-600 font-semibold mb-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone size={18} />
                    {t('contactElder')}
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteTask(task.id);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-3 text-lg font-bold transition-all"
                  >
                    {t('markComplete')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{t('taskDetails')}</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <XCircle size={32} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-lg font-semibold text-gray-600">{t('elderName')}</label>
                  <p className="text-2xl font-bold text-gray-800">{selectedTask.elderName}</p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-600">{t('serviceType')}</label>
                  <p className="text-xl text-gray-800 capitalize">{t(selectedTask.serviceType)}</p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-600">{t('address')}</label>
                  <p className="text-xl text-gray-800">{selectedTask.address}</p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-600">{t('distance')}</label>
                  <p className="text-xl text-gray-800">{selectedTask.distance}</p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-600">Description</label>
                  <p className="text-xl text-gray-800">{selectedTask.description}</p>
                </div>

                <a
                  href={`tel:${selectedTask.phone}`}
                  className="flex items-center justify-center gap-3 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl p-4 text-xl font-bold transition-all"
                >
                  <Phone size={24} />
                  {t('contactElder')}
                </a>

                {selectedTask.status === 'accepted' && (
                  <button
                    onClick={() => handleCompleteTask(selectedTask.id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl p-4 text-xl font-bold transition-all flex items-center justify-center gap-3"
                  >
                    <CheckCircle size={24} />
                    {t('markComplete')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

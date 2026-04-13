import { useState } from 'react';
import { X, Plus, Trash2, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  voiceAlert: boolean;
}

interface MedicineReminderProps {
  onClose: () => void;
}

export default function MedicineReminder({ onClose }: MedicineReminderProps) {
  const { t } = useLanguage();
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Aspirin',
      dosage: '1 tablet',
      times: ['09:00', '21:00'],
      voiceAlert: true,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    times: [''],
    voiceAlert: false,
  });

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.dosage) {
      setMedicines([
        ...medicines,
        {
          id: Date.now().toString(),
          name: newMedicine.name,
          dosage: newMedicine.dosage,
          times: newMedicine.times.filter((t) => t),
          voiceAlert: newMedicine.voiceAlert,
        },
      ]);
      setNewMedicine({ name: '', dosage: '', times: [''], voiceAlert: false });
      setShowAddForm(false);
    }
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const addTimeSlot = () => {
    setNewMedicine({ ...newMedicine, times: [...newMedicine.times, ''] });
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...newMedicine.times];
    newTimes[index] = value;
    setNewMedicine({ ...newMedicine, times: newTimes });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800">{t('medicineReminder')}</h2>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-all">
            <X size={36} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{medicine.name}</h3>
                  <p className="text-xl text-gray-600 mb-3">{medicine.dosage}</p>
                  <div className="flex flex-wrap gap-2">
                    {medicine.times.map((time, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl text-lg font-semibold flex items-center gap-2"
                      >
                        <Clock size={20} />
                        {time}
                      </span>
                    ))}
                  </div>
                  {medicine.voiceAlert && (
                    <p className="text-lg text-green-600 font-semibold mt-2">🔊 {t('voiceAlert')}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteMedicine(medicine.id)}
                  className="p-3 bg-red-100 hover:bg-red-200 rounded-full transition-all"
                >
                  <Trash2 size={24} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl p-6 text-2xl font-bold flex items-center justify-center gap-3 transition-all"
          >
            <Plus size={32} />
            {t('addMedicine')}
          </button>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('addMedicine')}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xl font-semibold text-gray-700 mb-2">
                  {t('medicineName')}
                </label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl text-xl focus:border-blue-500 focus:outline-none"
                  placeholder={t('medicineName')}
                />
              </div>

              <div>
                <label className="block text-xl font-semibold text-gray-700 mb-2">
                  {t('dosage')}
                </label>
                <input
                  type="text"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl text-xl focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 1 tablet"
                />
              </div>

              <div>
                <label className="block text-xl font-semibold text-gray-700 mb-2">
                  {t('reminderTimes')}
                </label>
                {newMedicine.times.map((time, index) => (
                  <input
                    key={index}
                    type="time"
                    value={time}
                    onChange={(e) => updateTime(index, e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl text-xl mb-2 focus:border-blue-500 focus:outline-none"
                  />
                ))}
                <button
                  onClick={addTimeSlot}
                  className="text-blue-600 text-lg font-semibold hover:underline flex items-center gap-2"
                >
                  <Plus size={20} />
                  {t('addTime')}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newMedicine.voiceAlert}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, voiceAlert: e.target.checked })
                  }
                  className="w-8 h-8 rounded"
                />
                <label className="text-xl font-semibold text-gray-700">{t('voiceAlert')}</label>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddMedicine}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl p-4 text-xl font-bold transition-all"
              >
                {t('save')}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewMedicine({ name: '', dosage: '', times: [''], voiceAlert: false });
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl p-4 text-xl font-bold transition-all"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

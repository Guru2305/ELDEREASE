import { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RequestType } from '../types/index';
import { useUser } from '../context/UserContext';
import { bookingAPI } from '../services/api';

interface RequestModalProps {
  serviceType: RequestType;
  onClose: () => void;
}

export default function RequestModal({ serviceType, onClose }: RequestModalProps) {
  const { t } = useLanguage();
  const { user } = useUser();
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim() || !user) return;
    
    setLoading(true);
    try {
      const bookingData = {
        serviceType: serviceType,
        title: `${t(serviceType)} Request`,
        description: description,
        elderId: user.id,
        elderName: `${user.firstName} ${user.lastName}`,
        elderPhone: user.phone,
        elderAddress: user.address,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await bookingAPI.create(bookingData);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800 capitalize">{t(serviceType)}</h2>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-all">
            <X size={36} />
          </button>
        </div>

        {!submitted ? (
          <>
            <div className="mb-6">
              <label className="block text-2xl font-semibold text-gray-700 mb-3">
                {t('describeNeed')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full p-5 border-2 border-gray-300 rounded-2xl text-xl focus:border-blue-500 focus:outline-none"
                placeholder={t('describeNeed')}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl p-5 text-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : t('submit')}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-2xl p-5 text-2xl font-bold transition-all"
              >
                {t('cancel')}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-3xl font-bold text-green-600 mb-2">Request Submitted!</h3>
            <p className="text-xl text-gray-600">A volunteer will contact you shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}

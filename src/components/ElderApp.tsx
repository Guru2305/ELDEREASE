import { useState, useEffect } from 'react';
import { ShoppingCart, Pill, Car, Wrench, AlertCircle, Bell, Languages, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language, RequestType } from '../types';
import MedicineReminder from './MedicineReminder';
import RequestModal from './RequestModal';

export default function ElderApp() {
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMedicineReminder, setShowMedicineReminder] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState<RequestType | null>(null);
  const [shakeDetected, setShakeDetected] = useState(false);

  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeCount = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const { x = 0, y = 0, z = 0 } = event.accelerationIncludingGravity || {};

      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);

      if (deltaX + deltaY + deltaZ > 30) {
        shakeCount++;
        if (shakeCount > 2) {
          setShakeDetected(true);
          setTimeout(() => setShakeDetected(false), 3000);
          shakeCount = 0;
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, []);

  const services = [
    { type: 'groceries' as RequestType, icon: ShoppingCart, color: 'bg-emerald-500' },
    { type: 'medicines' as RequestType, icon: Pill, color: 'bg-blue-500' },
    { type: 'transport' as RequestType, icon: Car, color: 'bg-purple-500' },
    { type: 'household' as RequestType, icon: Wrench, color: 'bg-orange-500' },
    { type: 'emergency' as RequestType, icon: AlertCircle, color: 'bg-red-500' },
  ];

  const handleServiceClick = (type: RequestType) => {
    setSelectedService(type);
    setShowRequestModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-bold text-gray-800">{t('appName')}</h1>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all"
            >
              <Languages size={32} />
            </button>
          </div>

          {showLanguageMenu && (
            <div className="mb-6 p-6 bg-blue-50 rounded-2xl">
              <p className="text-2xl font-semibold mb-4 text-gray-700">{t('selectLanguage')}</p>
              <div className="grid grid-cols-3 gap-4">
                {(['en', 'ta', 'hi'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageMenu(false);
                    }}
                    className={`py-4 px-6 rounded-xl text-2xl font-semibold transition-all ${
                      language === lang
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    {lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ்' : 'हिंदी'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 mb-6">
            {services.map(({ type, icon: Icon, color }) => (
              <button
                key={type}
                onClick={() => handleServiceClick(type)}
                className={`${color} text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200`}
              >
                <Icon size={64} className="mx-auto mb-4" strokeWidth={2.5} />
                <p className="text-2xl font-bold">{t(type)}</p>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowMedicineReminder(true)}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-4"
          >
            <Bell size={48} strokeWidth={2.5} />
            <span className="text-3xl font-bold">{t('medicineReminder')}</span>
          </button>

          <div className="mt-6 p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-300">
            <p className="text-xl text-center text-gray-700 font-medium">{t('shakeForHelp')}</p>
          </div>
        </div>

        {shakeDetected && (
          <div className="fixed inset-0 bg-red-600 bg-opacity-95 flex items-center justify-center z-50 animate-pulse">
            <div className="text-center">
              <AlertCircle size={120} className="text-white mx-auto mb-6" />
              <h2 className="text-5xl font-bold text-white mb-4">{t('emergency')}</h2>
              <p className="text-3xl text-white">Calling emergency contact...</p>
            </div>
          </div>
        )}
      </div>

      {showMedicineReminder && (
        <MedicineReminder onClose={() => setShowMedicineReminder(false)} />
      )}

      {showRequestModal && selectedService && (
        <RequestModal
          serviceType={selectedService}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}

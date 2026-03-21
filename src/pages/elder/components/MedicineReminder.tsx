import { useState, useEffect } from 'react';
import { Bell, Check, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Medicine {
    id: number;
    name: string;
    time: string;
    taken: boolean;
}

interface Notification {
    id: number;
    message: string;
    type?: 'medicine' | 'booking' | 'emergency' | 'general';
}

interface MedicineReminderProps {
    onNotification: (notifications: Notification[]) => void;
}

export default function MedicineReminder({ onNotification }: MedicineReminderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [medicines, setMedicines] = useState<Medicine[]>([
        { id: 1, name: "Diabetes Pill", time: "09:00 AM", taken: true },
        { id: 2, name: "Vitamin D", time: "02:00 PM", taken: false },
        { id: 3, name: "Heart Medicine", time: "08:00 PM", taken: false },
    ]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const toggleTaken = (id: number) => {
        setMedicines(medicines.map(med =>
            med.id === id ? { ...med, taken: !med.taken } : med
        ));
    };

    const speak = (text: string) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime =
                now.getHours().toString().padStart(2, "0") +
                ":" +
                now.getMinutes().toString().padStart(2, "0");

            medicines.forEach((med) => {
                const medTime = med.time.replace(/\s?(AM|PM)/i, '').replace(/^0/, '');
                const currentFormatted = currentTime.replace(/^0/, '');
                
                if (medTime === currentFormatted && !med.taken) {
                    const newNotification = {
                        id: Date.now(),
                        message: `Time to take ${med.name}`,
                        type: 'medicine' as const
                    };
                    
                    setNotifications((prev) => [...prev, newNotification]);
                    if (onNotification) {
                        onNotification([...notifications, newNotification]);
                    }
                    
                    speak(`Reminder. Time to take ${med.name}`);
                }
            });
        }, 60000); // check every minute

        return () => clearInterval(interval);
    }, [medicines, onNotification, notifications]);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
                    >
                        <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Bell className="w-6 h-6 text-emerald-600" />
                                Medicines Today
                            </h2>

                            <div className="space-y-4">
                                {medicines.map(med => (
                                    <div
                                        key={med.id}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${med.taken
                                                ? 'border-emerald-100 bg-emerald-50 opacity-50'
                                                : 'border-slate-100 bg-white shadow-sm'
                                            }`}
                                    >
                                        <div>
                                            <h3 className={`font-bold text-lg ${med.taken ? 'text-emerald-800 line-through' : 'text-slate-800'}`}>
                                                {med.name}
                                            </h3>
                                            <p className="text-slate-500 font-medium">{med.time}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleTaken(med.id)}
                                            className={`p-3 rounded-full transition-colors ${med.taken
                                                    ? 'bg-emerald-200 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600'
                                                }`}
                                        >
                                            <Check className="w-6 h-6" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                                <Plus className="w-5 h-5" />
                                Add New Medicine
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

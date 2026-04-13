import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Pill, ShoppingBasket, Car, AlertTriangle, Home, Heart, Activity, Droplets, Apple, Cookie, Utensils, Users, Calendar, Wrench, HelpCircle, Sun } from 'lucide-react';
import VoiceAssistant from './components/VoiceAssistant';
import MedicineReminder from './components/MedicineReminder';
import NotificationBell from './components/NotificationBell';
import RealMap from '../../components/shared/RealMap';
import RequestService from '../../services/RequestService';

// Import service images
import medicineImg from "./image/medicine.png";
import groceryImg from "./image/groceris.png";
import transportImg from "./image/transpot.png";
import homeImg from "./image/home.png";
import callImg from "./image/call.png";

// Get current location function
const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                console.error('Error getting location:', error);
                // Use default Chennai location on error
                resolve({ latitude: 13.0827, longitude: 80.2707 });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
};

// Service request creation functions
const createServiceRequest = async (taskType: string, urgent: boolean = false) => {
    try {
        const location = await getCurrentLocation();
        const address = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
        
        const request = RequestService.addRequest({
            elderName: 'Elder User',
            taskType,
            location: address,
            coordinates: location,
            urgent,
            message: `Request for ${taskType} from Elder App`
        });

        // Show notification
        const notification = {
            id: Date.now(),
            message: `${taskType} request sent successfully!`,
            type: 'success' as const
        };

        return request;
    } catch (error) {
        console.error('Failed to create request:', error);
        throw error;
    }
};

export default function ElderHome() {
    const [language, setLanguage] = useState<'en' | 'ta' | 'hi'>('en');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [showTerms, setShowTerms] = useState(false);
    const [showItems, setShowItems] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [showTracking, setShowTracking] = useState(false);
    const [volunteer, setVolunteer] = useState<{ name: string; eta: number } | null>(null);
    const [elderLocation, setElderLocation] = useState({ latitude: 13.0827, longitude: 80.2707 });

    // Get elder's current location
    useEffect(() => {
        const getLocation = async () => {
            try {
                const location = await getCurrentLocation();
                setElderLocation(location);
            } catch (error) {
                console.error('Failed to get location:', error);
                // Keep default location if geolocation fails
            }
        };
        
        getLocation();
    }, []);

    

    // Trigger SOS handler
    const handleSOS = async () => {
        try {
            const request = await createServiceRequest('Emergency SOS - Fall Detected', true);
            
            // Add emergency notification
            const emergencyNotification = {
                id: Date.now(),
                message: "SOS Alert Sent! Emergency help requested.",
                type: 'emergency' as const
            };
            setNotifications(prev => [...prev, emergencyNotification]);
            
            alert("SOS ALERT SENT! Volunteers will be notified immediately.");
        } catch (error) {
            console.error('Failed to send SOS:', error);
            alert("Failed to send SOS. Please try again.");
        }
    };

    const translations = {
        en: {
            welcome: "Welcome",
            sos: "SOS HELP",
            medicine: "Medicines",
            grocery: "Groceries",
            ride: "Transport",
            help: "House Help",
            call: "Call Support",
            selectItems: "Select Items",
            selected: "selected",
            continue: "Continue",
            back: "Back",
            cancel: "Cancel",
            terms: "Service Terms",
            acceptBook: "Accept & Book",
            selectAtLeastOne: "Please select at least one item to continue",
            bookService: "Book Service",
            viewTerms: "View Terms",
            selectedItems: "Selected Items:",
            whatIncluded: "What's Included:",
            importantInfo: "Important Information:",
            yourResponsibilities: "Your Responsibilities:",
            volunteerBackground: "Volunteers are background-checked",
            serviceHours: "Services available 6 AM - 10 PM",
            emergencyPriority: "Emergency requests prioritized",
            noCost: "No cost for basic services",
            photoVerification: "Photo verification of volunteers",
            clearInstructions: "Provide clear delivery instructions",
            beAvailable: "Be available at scheduled time",
            paymentReady: "Have payment method ready (if applicable)",
            treatWithRespect: "Treat volunteers with respect",
            nearbyVolunteer: "A nearby volunteer will come to your location.",
            bookSuccess: "booked successfully!",
            items: "Items:",
            tapToBook: "Tap to Book"
        },
        ta: {
            welcome: "வணக்கம்",
            sos: "அவசரம் உதவி",
            medicine: "மருந்துகள்",
            grocery: "மளிகை பொருட்கள்",
            ride: "போக்குவரத்து",
            help: "வீட்டு உதவி",
            call: "அழைப்பு ஆதரவு",
            selectItems: "பொருட்களைத் தேர்ந்தெடுக்கவும்",
            selected: "தேர்ந்தெடுக்கப்பட்டது",
            continue: "தொடரவும்",
            back: "பின்",
            cancel: "ரத்து செய்",
            terms: "சேவை விதிமுறைகள்",
            acceptBook: "ஏற்றுக்கொண்டு முன்பதிவு செய்",
            selectAtLeastOne: "தொடர குறைந்தது ஒரு பொருளைத் தேர்ந்தெடுக்கவும்",
            bookService: "சேவையை முன்பதிவு செய்",
            viewTerms: "விதிமுறைகளைப் பார்",
            selectedItems: "தேர்ந்தெடுக்கப்பட்ட பொருட்கள்:",
            whatIncluded: "சேர்க்கப்பட்டவை:",
            importantInfo: "முக்கிய தகவல்:",
            yourResponsibilities: "உங்கள் பொறுப்புகள்:",
            volunteerBackground: "தன்னார்வர்கள் பின்னணி சரிபார்க்கப்பட்டவர்கள்",
            serviceHours: "சேவைகள் காலை 6 மணி முதல் இரவு 10 மணி வரை",
            emergencyPriority: "அவசர கோரிக்கைகளுக்கு முன்னுரிமை",
            noCost: "அடிப்படை சேவைகளுக்கு கட்டணம் இல்லை",
            photoVerification: "தன்னார்வர்களின் புகைப்பட சரிபார்ப்பு",
            clearInstructions: "தெளிவான டெலிவரி வழிமுறைகளை வழங்கவும்",
            beAvailable: "திட்டமிடப்பட்ட நேரத்தில் கிடைக்கும்படி இருங்கள்",
            paymentReady: "கட்டணம் செலுத்தும் முறையை தயாராக வைத்திருங்கள் (பொருந்தினால்)",
            treatWithRespect: "தன்னார்வர்களை மரியாதையுடன் நடத்தவும்",
            nearbyVolunteer: "அருகிலுள்ள ஒரு தன்னார்வர் உங்கள் இருப்பிடத்திற்கு வருவார்.",
            bookSuccess: "வெற்றிகரமாக முன்பதிவு செய்யப்பட்டது!",
            items: "பொருட்கள்:",
            tapToBook: "தட்டச்சு முன்பதிவு"
        },
        hi: {
            welcome: "स्वागत है",
            sos: "आपातकालीन सहायता",
            medicine: "दवाएं",
            grocery: "किराना",
            ride: "परिवहन",
            help: "घरेलू सहायता",
            call: "कॉल सहायता",
            selectItems: "वस्तुएं चुनें",
            selected: "चयनित",
            continue: "जारी रखें",
            back: "पीछे",
            cancel: "रद्द करें",
            terms: "सेवा नियम",
            acceptBook: "स्वीकार करें और बुक करें",
            selectAtLeastOne: "जारी रखने के लिए कम से कम एक वस्तु चुनें",
            bookService: "सेवा बुक करें",
            viewTerms: "नियम देखें",
            selectedItems: "चयनित वस्तुएं:",
            whatIncluded: "शामिल है:",
            importantInfo: "महत्वपूर्ण जानकारी:",
            yourResponsibilities: "आपकी जिम्मेदारियां:",
            volunteerBackground: "स्वयंसेवकों की पृष्ठभूमि जांच की गई है",
            serviceHours: "सेवाएं सुबह 6 बजे से रात 10 बजे तक उपलब्ध",
            emergencyPriority: "आपातकालीन अनुरोधों को प्राथमिकता",
            noCost: "बुनियादी सेवाओं के लिए कोई लागत नहीं",
            photoVerification: "स्वयंसेवकों की फोटो सत्यापन",
            clearInstructions: "स्पष्ट डिलीवरी निर्देश प्रदान करें",
            beAvailable: "निर्धारित समय पर उपलब्ध रहें",
            paymentReady: "भुगतान विधि तैयार रखें (यदि लागू हो)",
            treatWithRespect: "स्वयंसेवकों के साथ सम्मान के साथ व्यवहार करें",
            nearbyVolunteer: "एक नजदीकी स्वयंसेवक आपके स्थान पर आएगा।",
            bookSuccess: "सफलतापूर्वक बुक किया गया!",
            items: "वस्तुएं:",
            tapToBook: "बुक करने के लिए टैप करें"
        }
    };

    const t = translations[language];
    const navigate = useNavigate();

    const handleCommand = (cmd: string) => {
        if (cmd === "medicines") setSelectedService("Medicines");
        if (cmd === "groceries") setSelectedService("Groceries");
        if (cmd === "transport") setSelectedService("Transport");
        if (cmd === "househelp") setSelectedService("House Help");
        if (cmd === "callsupport") setSelectedService("Call Support");
        if (cmd === "sos") handleSOS();
    };

    const handleBooking = () => {
        if (selectedService) {
            setShowItems(true);
        }
    };

    const handleItemSelection = (item: string) => {
        setSelectedItems(prev => 
            prev.includes(item) 
                ? prev.filter(i => i !== item)
                : [...prev, item]
        );
    };

    const proceedToTerms = () => {
        if (selectedItems.length > 0) {
            setShowItems(false);
            setShowTerms(true);
        } else {
            alert(t.selectAtLeastOne);
        }
    };

    const confirmBooking = async () => {
        if (!selectedService) return;

        try {
            const request = await createServiceRequest(selectedService, selectedService.includes('Emergency'));
            
            const bookingNotification = {
                id: Date.now(),
                message: selectedItems.length > 0
                    ? `${selectedService} service booked for ${selectedItems.length} items`
                    : `${selectedService} service booked`,
                type: 'booking' as const
            };
            setNotifications(prev => [...prev, bookingNotification]);

            const itemsText = selectedItems.length > 0 ? `\n${t.items} ${selectedItems.join(", ")}` : "";
            alert(`${selectedService} ${t.bookSuccess}${itemsText}`);

            // Simulate assigning a volunteer and open tracking
            setVolunteer({ name: 'reenish', eta: 7 });
            setShowTracking(true);

            setSelectedService(null);
            setShowTerms(false);
            setShowItems(false);
            setSelectedItems([]);
        } catch (error) {
            console.error('Failed to book service:', error);
            alert('Failed to book service. Please try again.');
        }
    };

    // Decrement ETA timer while tracking
    useEffect(() => {
        if (!showTracking || !volunteer) return;
        const timer = setInterval(() => {
            setVolunteer(prev => {
                if (!prev) return prev;
                if (prev.eta <= 0) return prev;
                return { ...prev, eta: prev.eta - 1 };
            });
        }, 60000); // decrement every minute

        return () => clearInterval(timer);
    }, [showTracking, volunteer]);

    return (
        
        <div className="min-h-screen bg-slate-100 flex flex-col pb-24">
            {/* Header */}
            <header className="bg-white p-6 shadow-sm flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/elder/profile')}
                        aria-label="Profile"
                        className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                    >
                        <User className="w-5 h-5 text-slate-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">{t.welcome}</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* SOS Button - Circular in Header */}
                    <button
  onClick={handleSOS}
  className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform relative overflow-hidden"
>
  {/* Pulse animation */}
  <div className="absolute inset-0 bg-red-500 animate-ping opacity-20 rounded-full"></div>

<AlertTriangle/>
  
</button>

                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className="bg-slate-100 border-none rounded-lg p-2 text-lg font-medium"
                    >
                        <option value="en">English</option>
                        <option value="ta">தமிழ்</option>
                        <option value="hi">हिंदी</option>
                    </select>
                </div>
            </header>

            <main className="flex-1 p-4 grid grid-cols-1 gap-4 auto-rows-fr">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ServiceCard
                        title={t.medicine}
                        color="bg-emerald-100 text-emerald-800 border-emerald-200"
                        image={medicineImg}
                        onClick={() => setSelectedService("Medicines")}
                        t={t}
                    />

                    <ServiceCard
                        title={t.grocery}
                        color="bg-orange-100 text-orange-800 border-orange-200"
                        image={groceryImg}
                        onClick={() => setSelectedService("Groceries")}
                        t={t}
                    />

                    <ServiceCard
                        title={t.ride}
                        color="bg-blue-100 text-blue-800 border-blue-200"
                        image={transportImg}
                        onClick={() => setSelectedService("Transport")}
                        t={t}
                    />

                    <ServiceCard
                        title={t.help}
                        color="bg-purple-100 text-purple-800 border-purple-200"
                        image={homeImg}
                        onClick={() => setSelectedService("House Help")}
                        t={t}
                    />

                    <ServiceCard
                        title={t.call}
                        color="bg-red-100 text-red-800 border-red-200"
                        image={callImg}
                        onClick={() => setSelectedService("Call Support")}
                        t={t}
                    />
                </div>
            </main>


            {/* Enhanced Booking Popup */}
            {selectedService && !showItems && !showTerms && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 text-center shadow-2xl border-2 border-gray-100">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">
                            {t.bookService} {selectedService}
                        </h2>
                        <p className="text-xl mb-6 text-gray-600">
                            {t.nearbyVolunteer}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setSelectedService(null);
                                    setSelectedItems([]);
                                }}
                                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl text-xl font-bold text-gray-700 transition-colors"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={confirmBooking}
                                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xl font-bold transition-colors shadow-lg"
                            >
                                {t.acceptBook}
                            </button>
                        </div>
                    </div>
                </div>
            )}

          
            {/* Terms and Conditions Modal */}
            {showTerms && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl border-2 border-gray-100 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            {t.terms} - {selectedService}
                        </h2>
                        
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 mb-4">
                            <h3 className="font-bold text-lg mb-2 text-emerald-800">{t.selectedItems}</h3>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                {selectedItems.map(item => (
                                    <li key={item} className="text-emerald-700">{item}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="text-left mb-6 space-y-4 text-gray-600">
                            <div>
                                <h3 className="font-bold text-lg mb-2">{t.whatIncluded}</h3>
                                {selectedService === "Medicines" && (
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Medicine delivery from nearby pharmacy</li>
                                        <li>Prescription verification</li>
                                        <li>Emergency medication requests</li>
                                        <li>Payment assistance available</li>
                                    </ul>
                                )}
                                {selectedService === "Groceries" && (
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Fresh grocery delivery</li>
                                        <li>Vegetables and fruits</li>
                                        <li>Dairy and bread products</li>
                                        <li>Special dietary requests</li>
                                    </ul>
                                )}
                                {selectedService === "Transport" && (
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Safe transportation to medical appointments</li>
                                        <li>Wheelchair accessible vehicles</li>
                                        <li>Trained volunteer drivers</li>
                                        <li>GPS-tracked rides</li>
                                    </ul>
                                )}
                                {selectedService === "House Help" && (
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Light house cleaning</li>
                                        <li>Minor repairs and maintenance</li>
                                        <li>Companion services</li>
                                        <li>Lawn and garden care</li>
                                    </ul>
                                )}
                                {selectedService === "Call Support" && (
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>24/7 phone support</li>
                                        <li>Emergency coordination</li>
                                        <li>Family notification service</li>
                                        <li>Medical emergency assistance</li>
                                    </ul>
                                )}
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">{t.importantInfo}</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>{t.volunteerBackground}</li>
                                    <li>{t.serviceHours}</li>
                                    <li>{t.emergencyPriority}</li>
                                    <li>{t.noCost}</li>
                                    <li>{t.photoVerification}</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">{t.yourResponsibilities}</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>{t.clearInstructions}</li>
                                    <li>{t.beAvailable}</li>
                                    <li>{t.paymentReady}</li>
                                    <li>{t.treatWithRespect}</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => {
                                    setShowTerms(false);
                                    setShowItems(true);
                                }}
                                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl text-xl font-bold text-gray-700 transition-colors"
                            >
                                {t.back} to {t.selectItems}
                            </button>
                            <button
                                onClick={confirmBooking}
                                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xl font-bold transition-colors shadow-lg"
                            >
                                {t.acceptBook}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tracking Modal (shows MockMap) */}
            {showTracking && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-3xl rounded-3xl p-6 shadow-2xl border-2 border-gray-100 h-[70vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Volunteer Tracking</h2>
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-gray-600">Volunteer: <span className="font-bold">{volunteer?.name}</span></div>
                                <div className="text-sm text-gray-600">ETA: <span className="font-bold">{volunteer && volunteer.eta > 0 ? `${volunteer.eta} min` : 'Arrived'}</span></div>
                                <button
                                    onClick={() => setShowTracking(false)}
                                    className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 rounded-lg overflow-hidden">
                            <RealMap 
                                location="Volunteer Tracking"
                                markers={[
                                    {
                                        id: 1,
                                        location: 'Volunteer Location',
                                        elderName: volunteer?.name || 'Volunteer',
                                        taskType: 'On the way',
                                        urgent: false,
                                        coordinates: volunteer ? {
                                            latitude: elderLocation.latitude + 0.01, // Simulate volunteer nearby
                                            longitude: elderLocation.longitude + 0.01
                                        } : elderLocation
                                    }
                                ]}
                                volunteerLocation={elderLocation}
                                height="100%"
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowTracking(false);
                                    setVolunteer(null);
                                }}
                                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold"
                            >
                                End Tracking
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <MedicineReminder onNotification={setNotifications} />
            <NotificationBell notifications={notifications} />
            <VoiceAssistant onCommand={handleCommand} />
        </div>
    );
}

/* Enhanced Service Card Component with Images and 3D Logo */
function ServiceCard({ title, color, image, onClick, t }: { title: string; color?: string; image: string; onClick?: () => void; t: { tapToBook: string } }) {
        return (
        <button
            onClick={onClick}
            className={`
                relative overflow-visible
        rounded-3xl border
        p-6
        ${color}
        
        shadow-[0_10px_25px_rgba(0,0,0,0.15)]
        hover:shadow-[0_18px_35px_rgba(0,0,0,0.25)]
        
        transform hover:-translate-y-2 hover:scale-[1.03]
        transition-all duration-300
      `}
    >
      {/* SHINE EFFECT */}
      <div className="absolute top-0 left-0 w-full h-16 bg-white/20 blur-xl"></div>

      {/* 3D IMAGE CONTAINER */}
            <div className="relative mb-6 w-64 h-64 mx-auto">
                {/* MAIN IMAGE - larger than container, centered and allowed to overflow */}
                <img
                    src={image}
                    alt={title}
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 object-contain transition-all duration-300 hover:scale-[1.2] hover:rotate-3"
                />
            </div>

      {/* TITLE */}
      <h2 className="text-3xl font-bold text-center">
        {title}
      </h2>

      {/* SUBTEXT */}
      <p className="text-lg text-center opacity-70 mt-2">
        {t.tapToBook}
      </p>

      {/* 3D BASE */}
      <div className="absolute bottom-0 left-0 w-full h-3 bg-black/5 rounded-b-3xl"></div>
    </button>
  );
}


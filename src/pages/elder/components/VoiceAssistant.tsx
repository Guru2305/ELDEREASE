import { useEffect, useRef, useState } from "react";
import { Mic, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceAssistantProps {
    onCommand: (command: string) => void;
}

export default function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event: any) => {
                const command = event.results[0][0].transcript.toLowerCase();
                handleCommand(command);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const speak = (text: string) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);
    };

    const handleCommand = (command: string) => {
        setTranscript(command);
        speak(`You said ${command}`);

        if (command.includes("medicine")) {
            onCommand("medicines");
        } else if (command.includes("groceries")) {
            onCommand("groceries");
        } else if (command.includes("transport")) {
            onCommand("transport");
        } else if (command.includes("house help")) {
            onCommand("househelp");
        } else if (command.includes("call support")) {
            onCommand("callsupport");
        } else if (command.includes("emergency")) {
            onCommand("sos");
        } else {
            speak("Sorry, I did not understand");
            setTimeout(() => setIsListening(false), 2000);
        }
    };

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            setTranscript('');
            recognitionRef.current.start();
        } else {
            // Fallback to simulation if speech recognition is not available
            setIsListening(true);
            setTranscript('');

            setTimeout(() => {
                setTranscript("Start listening...");
                setTimeout(() => {
                    const mockCommands = [
                        "I need medicines",
                        "Call my son", 
                        "Book a ride to temple",
                        "I need groceries"
                    ];
                    const randomCmd = mockCommands[Math.floor(Math.random() * mockCommands.length)];
                    handleCommand(randomCmd);
                }, 1000);
            }, 500);
        }
    };

    return (
        <>
            <button
                onClick={startListening}
                className={`fixed bottom-8 left-8 text-white p-6 rounded-full shadow-lg transition-colors z-50 ${
                    isListening ? "bg-red-600" : "bg-emerald-600"
                }`}
                aria-label="Voice Assistant"
            >
                <Mic className="w-8 h-8" />
            </button>

            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setIsListening(false)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="bg-emerald-500 p-8 rounded-full mb-8"
                        >
                            <Mic className="w-12 h-12 text-white" />
                        </motion.div>

                        <p className="text-white text-2xl font-medium text-center">
                            {transcript || "Listening..."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

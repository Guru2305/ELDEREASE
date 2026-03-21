import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDuty } from '../context/DutyContext';
import { Power, AlertTriangle } from 'lucide-react';

interface DutyProtectionProps {
    children: React.ReactNode;
}

export default function DutyProtection({ children }: DutyProtectionProps) {
    const { isOnDuty } = useDuty();
    const navigate = useNavigate();

    if (!isOnDuty) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Power className="w-8 h-8 text-amber-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Duty Must Be ON</h2>
                        <p className="text-slate-600 mb-6">
                            This feature is only available when you are on duty. Please turn your duty ON to access this page.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/volunteer')}
                                className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                            >
                                Go to Dashboard
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

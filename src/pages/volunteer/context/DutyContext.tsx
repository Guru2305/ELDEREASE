import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DutyContextType {
    isOnDuty: boolean;
    setIsOnDuty: (value: boolean) => void;
}

const DutyContext = createContext<DutyContextType | undefined>(undefined);

export const useDuty = () => {
    const context = useContext(DutyContext);
    if (!context) {
        throw new Error('useDuty must be used within a DutyProvider');
    }
    return context;
};

export const DutyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOnDuty, setIsOnDuty] = useState(true);

    return (
        <DutyContext.Provider value={{ isOnDuty, setIsOnDuty }}>
            {children}
        </DutyContext.Provider>
    );
};

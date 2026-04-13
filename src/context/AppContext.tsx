import { createContext, useContext, useState, ReactNode } from 'react';
import { UserType } from '../types';

interface AppContextType {
  currentView: 'elder' | 'volunteer' | 'admin';
  setCurrentView: (view: 'elder' | 'volunteer' | 'admin') => void;
  userType: UserType;
  setUserType: (type: UserType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<'elder' | 'volunteer' | 'admin'>('elder');
  const [userType, setUserType] = useState<UserType>('elder');

  return (
    <AppContext.Provider value={{ currentView, setCurrentView, userType, setUserType }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

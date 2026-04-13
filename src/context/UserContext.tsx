import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'elder' | 'volunteer';
  age?: number;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  [key: string]: any;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Try to get fresh data from backend
        try {
          if (userData.role === 'elder') {
            const response = await api.get('/elders/profile');
            setUser(response.data.elder);
            localStorage.setItem('user', JSON.stringify(response.data.elder));
          } else if (userData.role === 'volunteer') {
            const response = await api.get('/volunteers/profile');
            setUser(response.data.volunteer);
            localStorage.setItem('user', JSON.stringify(response.data.volunteer));
          }
        } catch (error) {
          console.log('Using cached user data:', error);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update backend
      if (user.role === 'elder') {
        await api.put('/elders/profile', userData);
      } else if (user.role === 'volunteer') {
        await api.put('/volunteers/profile', userData);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

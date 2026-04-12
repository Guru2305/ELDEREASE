export type UserType = 'elder' | 'volunteer' | 'admin';
export type Language = 'en' | 'ta';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserType;
}

export interface Elder extends User {
  phone: string;
  age: number;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  emergencyContacts: Array<{
    name: string;
    relation: string;
    phone: string;
  }>;
}

export interface Volunteer extends User {
  phone: string;
  age: number;
  skills: string[];
  availability: Record<string, boolean>;
}

export type Language = 'en' | 'ta' | 'hi';

export type UserType = 'elder' | 'volunteer' | 'admin' | 'family';

export type RequestType = 'groceries' | 'medicines' | 'transport' | 'household' | 'emergency';

export type RequestStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  user_type: UserType;
  preferred_language: Language;
  area: string;
  address?: string;
  emergency_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface Volunteer {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  services: string[];
  rating: number;
  total_tasks: number;
  is_available: boolean;
  created_at: string;
}

export interface Request {
  id: string;
  elder_id: string;
  volunteer_id?: string;
  request_type: RequestType;
  description?: string;
  status: RequestStatus;
  area: string;
  address: string;
  created_at: string;
  completed_at?: string;
}

export interface Medicine {
  id: string;
  elder_id: string;
  medicine_name: string;
  dosage?: string;
  reminder_times: string[];
  voice_alert: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  request_id: string;
  elder_id: string;
  volunteer_id?: string;
  amount: number;
  payment_method: 'cash' | 'upi' | 'membership';
  status: 'pending' | 'completed';
  created_at: string;
}

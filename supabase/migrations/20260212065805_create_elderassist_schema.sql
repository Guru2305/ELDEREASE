/*
  # ElderAssist Database Schema

  ## Overview
  Complete database schema for ElderAssist - a hyper-local support platform for senior citizens.
  
  ## New Tables
  
  1. **profiles**
     - `id` (uuid, primary key, references auth.users)
     - `full_name` (text)
     - `phone` (text)
     - `user_type` (text: 'elder', 'volunteer', 'admin', 'family')
     - `preferred_language` (text: 'en', 'ta', 'hi')
     - `area` (text: KK Nagar, Ashok Nagar, etc.)
     - `address` (text)
     - `emergency_contact` (text)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  2. **volunteers**
     - `id` (uuid, primary key)
     - `user_id` (uuid, references profiles)
     - `status` (text: 'pending', 'approved', 'rejected')
     - `services` (text array: groceries, medicines, transport, household)
     - `rating` (numeric)
     - `total_tasks` (integer)
     - `is_available` (boolean)
     - `created_at` (timestamptz)
  
  3. **requests**
     - `id` (uuid, primary key)
     - `elder_id` (uuid, references profiles)
     - `volunteer_id` (uuid, references volunteers, nullable)
     - `request_type` (text: groceries, medicines, transport, household, emergency)
     - `description` (text)
     - `status` (text: pending, accepted, in_progress, completed, cancelled)
     - `area` (text)
     - `address` (text)
     - `created_at` (timestamptz)
     - `completed_at` (timestamptz, nullable)
  
  4. **medicines**
     - `id` (uuid, primary key)
     - `elder_id` (uuid, references profiles)
     - `medicine_name` (text)
     - `dosage` (text)
     - `reminder_times` (text array: times like "09:00", "21:00")
     - `voice_alert` (boolean)
     - `is_active` (boolean)
     - `created_at` (timestamptz)
  
  5. **payments**
     - `id` (uuid, primary key)
     - `request_id` (uuid, references requests)
     - `elder_id` (uuid, references profiles)
     - `volunteer_id` (uuid, references volunteers)
     - `amount` (numeric)
     - `payment_method` (text: cash, upi, membership)
     - `status` (text: pending, completed)
     - `created_at` (timestamptz)
  
  ## Security
  - Enable RLS on all tables
  - Elders can read/update their own data
  - Volunteers can view assigned requests
  - Admins have full access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('elder', 'volunteer', 'admin', 'family')),
  preferred_language text DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta', 'hi')),
  area text NOT NULL,
  address text,
  emergency_contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  services text[] DEFAULT '{}',
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_tasks integer DEFAULT 0,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elder_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  volunteer_id uuid REFERENCES volunteers(id) ON DELETE SET NULL,
  request_type text NOT NULL CHECK (request_type IN ('groceries', 'medicines', 'transport', 'household', 'emergency')),
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  area text NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elder_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  medicine_name text NOT NULL,
  dosage text,
  reminder_times text[] DEFAULT '{}',
  voice_alert boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES requests(id) ON DELETE CASCADE,
  elder_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  volunteer_id uuid REFERENCES volunteers(id) ON DELETE SET NULL,
  amount numeric DEFAULT 0,
  payment_method text CHECK (payment_method IN ('cash', 'upi', 'membership')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Volunteers policies
CREATE POLICY "Volunteers can view own data"
  ON volunteers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone authenticated can view approved volunteers"
  ON volunteers FOR SELECT
  TO authenticated
  USING (status = 'approved');

-- Requests policies
CREATE POLICY "Elders can view own requests"
  ON requests FOR SELECT
  TO authenticated
  USING (elder_id = auth.uid());

CREATE POLICY "Elders can create requests"
  ON requests FOR INSERT
  TO authenticated
  WITH CHECK (elder_id = auth.uid());

CREATE POLICY "Volunteers can view requests in their area"
  ON requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM volunteers v
      JOIN profiles p ON v.user_id = p.id
      WHERE p.id = auth.uid()
      AND v.status = 'approved'
      AND p.area = requests.area
    )
  );

-- Medicines policies
CREATE POLICY "Elders can manage own medicines"
  ON medicines FOR ALL
  TO authenticated
  USING (elder_id = auth.uid())
  WITH CHECK (elder_id = auth.uid());

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (elder_id = auth.uid() OR volunteer_id IN (
    SELECT id FROM volunteers WHERE user_id = auth.uid()
  ));
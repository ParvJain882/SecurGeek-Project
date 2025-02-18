/*
  # Initial Schema Setup for SecurGeek

  1. New Tables
    - `demo_bookings`
      - For scheduling training demos
      - Tracks contact info and preferred time
    - `contacts`
      - For contact form submissions
      - Stores messages and inquiries
    - `newsletters`
      - For newsletter subscriptions
      - Manages email subscriptions

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
*/

-- Demo Bookings Table
CREATE TABLE IF NOT EXISTS demo_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create demo bookings"
  ON demo_bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact forms"
  ON contacts
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);

ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletters
  FOR INSERT
  TO public
  WITH CHECK (true);
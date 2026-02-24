-- ============================================
-- PanditJi Booking Platform — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- 1. USERS
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'pandit', 'admin')),
  avatar_url TEXT,
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_role ON users(role);

-- =====================
-- 2. PANDITS
-- =====================
CREATE TABLE IF NOT EXISTS pandits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  specializations TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  city TEXT,
  state TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_pujas INTEGER DEFAULT 0,
  documents_url TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pandits_status ON pandits(status);
CREATE INDEX idx_pandits_city ON pandits(city);
CREATE INDEX idx_pandits_rating ON pandits(rating DESC);

-- =====================
-- 3. SERVICES (Puja types)
-- =====================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration TEXT, -- e.g. "2 Hours", "3 Days"
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 4. PANDIT_SERVICES (many-to-many)
-- =====================
CREATE TABLE IF NOT EXISTS pandit_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pandit_id UUID REFERENCES pandits(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  custom_price DECIMAL(10,2),
  UNIQUE(pandit_id, service_id)
);

-- =====================
-- 5. BOOKINGS
-- =====================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pandit_id UUID REFERENCES pandits(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time_slot TEXT,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT CHECK (payment_method IN ('stripe', 'razorpay', 'wallet', 'cash', NULL)),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_pandit ON bookings(pandit_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(date);

-- =====================
-- 6. PAYMENTS
-- =====================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT CHECK (method IN ('stripe', 'razorpay', 'wallet', 'cash')),
  stripe_payment_id TEXT,
  razorpay_order_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

-- =====================
-- 7. REVIEWS
-- =====================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pandit_id UUID REFERENCES pandits(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_pandit ON reviews(pandit_id);

-- =====================
-- 8. WALLET
-- =====================
CREATE TABLE IF NOT EXISTS wallet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 9. TRANSACTIONS
-- =====================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallet(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);

-- =====================
-- 10. NOTIFICATIONS
-- =====================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  type TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- =====================
-- 11. AVAILABILITY
-- =====================
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pandit_id UUID REFERENCES pandits(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_availability_pandit ON availability(pandit_id);

-- =====================
-- 12. COUPONS
-- =====================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  max_uses INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 13. ADMIN_LOGS
-- =====================
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);

-- =====================
-- 14. REPORTS
-- =====================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  target_type TEXT CHECK (target_type IN ('user', 'pandit', 'booking')),
  target_id UUID,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports(status);

-- =====================
-- SEED DATA — Sample Services
-- =====================
INSERT INTO services (name, description, category, base_price, duration, image_url, is_active) VALUES
  ('Griha Pravesh', 'Essential rituals for entering a new house with divine blessings.', 'Home', 3100, '2 Hours', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUHfWNoVrTdjiK9mIU47iA_frG3_0LAxGulpOv3MpkQmtCNFglFg46FvMBmwEweUmVH3ZX_Q_QZyV_lyFa9xy2Vdq9jGvPj5gpLBWRJayE1OSTSWgr96OWdS3eTGZhAL-CJgoCJfnCPPAQPctiljtnZ8GNak-VOenffd5mu6bKIeCCOKEBAWiwR_9WbZO8741Va48MZwchQPovVRt2d9YUDcnoVgrOUnd9xlhu3IfIPxLFkpUdv6v8zA5jDwPYR_NO1ajSQ2IGnIg', TRUE),
  ('Marriage Puja', 'Complete Vedic ceremony for a blessed and auspicious union.', 'Wedding', 5100, '4 Hours', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT22mb7Y4hnXsvdL18zoPXLDvn7cFx960WwM6kJ2bLS3TKQ8B8bzDmey4DeLU9NL7CWvJxHKHaGDmeAx-G9_IkR5xPjA0pQKVL7vqjP30nzyoAfNFG75cgesiQZ8WA1tklmQHKPdsZKFz9DVAQC6iDPwh0DxR64zErA_wX4o0qiliK_lD2vQr-zdOZxEwLtUBG4P0lGW6LalrIEdP38jmfda_O7_4TAvmcgqfFThWvMgrWVzEx6zWopAIpCab6tQikesCJZe4taiI', TRUE),
  ('Vastu Shanti', 'Bring peace and positive energy to your new home.', 'Home', 7500, '6 Hours', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHRXqA1mCecASV6HJCl-azPKNkrApcYdyQqR2_ZZvxyJ_bsFA02oQBYjXmR2nXlQZFGSgipJWeEi9LvgBg-vAm-SL5FnDBUnlOSCY7BbCUfQCMNi3ZyabVc9NIRSsg2ErY1kNiCwqWtymbdNnnHhtTs_lrVxTBAPdRhF7ZWYt-H6hGZ6IWf9psPcvBj6I86-Sptk2cDZckVmbrjvzH9XOVh2S-M-zmPz1fp3yAx8r_g_2KZxIGmbv4JVDmAGnHkms0DgKPycYM6fI', TRUE),
  ('Maha Mrityunjaya Jaap', 'Powerful jaap for longevity, health, and protection.', 'Special', 11000, '3 Days', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEpvhMnZmtqeSJEVKF-GC795CtnlOPCceKuMkTVqw1FlbQTYWWQLKZG2zjFUXHdWoVQep0PKAPqJxCmSoEI3v7al3dEwiU63Wjqs1R1q8rSKhqbMHJsca5n1zdVarQ8ALUoVGkJ0o6OHR_RpwClLhjNz4mCeKP0eJlBc7R69jB36bPlrAifYgyhgUvqroK8gaeSptMyyq0aGedDUuj6NHWpg9qjIOR13vF-kqJrFcwiUWWq0C_nc_YkIi_mQgbJn6jcul7PS_WsIE', TRUE),
  ('Satyanarayan Katha', 'Monthly puja for prosperity and well-being.', 'Regular', 2100, '2 Hours', NULL, TRUE),
  ('Ganesh Puja', 'Worship of Lord Ganesh for removing obstacles.', 'Regular', 1500, '1.5 Hours', NULL, TRUE),
  ('Navgraha Shanti', 'Planetary peace puja for balancing celestial influences.', 'Special', 5500, '3 Hours', NULL, TRUE),
  ('Rudrabhishek', 'Sacred abhishek of Lord Shiva with holy offerings.', 'Special', 4100, '2.5 Hours', NULL, TRUE)
ON CONFLICT DO NOTHING;

-- =====================
-- SEED DATA — Sample Coupons
-- =====================
INSERT INTO coupons (code, discount_percent, max_discount, max_uses, expires_at, is_active) VALUES
  ('WELCOME10', 10, 500, 1000, '2027-12-31', TRUE),
  ('DIWALI20', 20, 1000, 500, '2027-11-15', TRUE),
  ('HOLI15', 15, 750, 300, '2027-03-31', TRUE)
ON CONFLICT DO NOTHING;

-- =====================
-- 15. USER PROFILE ENHANCEMENTS (PHASE 3)
-- =====================

-- Add FCM Token to users for Firebase Push Notifications
ALTER TABLE users ADD COLUMN IF NOT EXISTS fcm_token TEXT;

-- Create Saved Pandits joining table
CREATE TABLE IF NOT EXISTS saved_pandits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pandit_id UUID REFERENCES pandits(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pandit_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_pandits_user ON saved_pandits(user_id);

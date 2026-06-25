-- ============================================================
-- Let's AFK - Database Schema (Sprint 1)
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================================

-- Enum types
CREATE TYPE afk_type_enum AS ENUM ('Big AFK', 'Mini AFK', 'Brand Visit');
CREATE TYPE indoor_outdoor_enum AS ENUM ('indoor', 'outdoor', 'hybrid');
CREATE TYPE format_enum AS ENUM ('just talking', 'activity-based', 'mixed');
CREATE TYPE payment_status_enum AS ENUM ('unpaid', 'paid');
CREATE TYPE attendance_status_enum AS ENUM ('registered', 'attended', 'no-show');

-- ============================================================
-- Tabel participants
-- Satu baris per orang unik, identitas utama = nomor WhatsApp
-- ============================================================
CREATE TABLE participants (
  participant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,  -- nullable karena data historis lama mungkin tidak punya email
  instagram TEXT,
  pronouns TEXT,
  age INTEGER,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Tabel events
-- Satu baris per event
-- ============================================================
CREATE TABLE events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  afk_type afk_type_enum NOT NULL,
  volume_number INTEGER,  -- hanya diisi untuk Big AFK
  date DATE NOT NULL,
  venue TEXT NOT NULL,
  indoor_outdoor indoor_outdoor_enum NOT NULL,
  format format_enum NOT NULL,
  topic_or_theme TEXT NOT NULL,
  description TEXT NOT NULL,
  collaborators TEXT[],  -- array nama kolaborator/fasilitator
  price INTEGER NOT NULL,  -- dalam IDR
  capacity INTEGER NOT NULL,
  host_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Tabel registrations
-- Tabel jembatan antara participants dan events
-- ============================================================
CREATE TABLE registrations (
  registration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payment_status payment_status_enum NOT NULL DEFAULT 'unpaid',
  attendance_status attendance_status_enum NOT NULL DEFAULT 'registered',
  how_they_heard TEXT,
  event_specific_answers JSONB,

  -- Satu orang tidak bisa double-register ke event yang sama
  UNIQUE (participant_id, event_id)
);

-- GIN index pada event_specific_answers supaya bisa dicari dan difilter
CREATE INDEX idx_registrations_event_specific_answers
  ON registrations USING GIN (event_specific_answers);

-- Index tambahan untuk query yang sering dipakai
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_participant_id ON registrations(participant_id);

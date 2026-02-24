-- ============================================
-- Migration: Add bilingual support + extended fields
-- Run this in Supabase SQL Editor
-- ============================================

-- Add new columns to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS name_hi TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS description_hi TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS items_included TEXT[];
ALTER TABLE services ADD COLUMN IF NOT EXISTS benefits TEXT[];
ALTER TABLE services ADD COLUMN IF NOT EXISTS mantra_count TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS duration_hours TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS pandits_required INTEGER DEFAULT 1;
ALTER TABLE services ADD COLUMN IF NOT EXISTS samagri_available BOOLEAN DEFAULT TRUE;

-- Clear old seed data
DELETE FROM services;

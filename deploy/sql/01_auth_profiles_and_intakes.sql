-- ====================================================================
-- MigraineRelief AI: Open-Source Supabase Auth, Profiles & Custom Intakes
-- Architecture: Near-$0 COGS Identity & State Persistence Layer
-- Canonical Reference: PRD Section 7.3 & System Design Section 8.3
-- ====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (1:1 with auth.users managed by GoTrue)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Patient Customized Intake & Clinical Profile Table
CREATE TABLE IF NOT EXISTS public.patient_custom_intakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    form_values JSONB NOT NULL DEFAULT '{}'::jsonb,
    aura_patterns TEXT[] NOT NULL DEFAULT '{}',
    customized_protocol JSONB NOT NULL DEFAULT '{}'::jsonb,
    aura_progression_notes TEXT,
    gst_timestamp TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_patient_user UNIQUE (user_id)
);

-- 3. Administrative Action Audit Log Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.user_profiles(id),
    target_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL CHECK (action IN ('RESET_PASSWORD', 'CHANGE_STATUS', 'ARCHIVE_USER', 'DELETE_USER')),
    details JSONB DEFAULT '{}'::jsonb,
    timestamp_utc TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Automatic Timestamp Update Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_intakes_updated_at ON public.patient_custom_intakes;
CREATE TRIGGER set_intakes_updated_at
BEFORE UPDATE ON public.patient_custom_intakes
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Row-Level Security (RLS) Configuration
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_custom_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Patients can inspect their own profile
CREATE POLICY "Users can read own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Patients can read and update their own customized intake record
CREATE POLICY "Users can read own intake" ON public.patient_custom_intakes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own intake" ON public.patient_custom_intakes
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admins hold full read/write visibility across profiles and custom intakes
CREATE POLICY "Admins full access profiles" ON public.user_profiles
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins read intakes" ON public.patient_custom_intakes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins full access audit logs" ON public.admin_audit_logs
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

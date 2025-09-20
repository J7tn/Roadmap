-- Create translations table for storing app translations
-- This table stores translation data for different languages

CREATE TABLE IF NOT EXISTS public.translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    language_code VARCHAR(5) NOT NULL,
    translation_data JSONB NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_translations_language_code ON public.translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_language_active ON public.translations(language_code, is_active);
CREATE INDEX IF NOT EXISTS idx_translations_version ON public.translations(language_code, version);

-- Create unique constraint to prevent duplicate active versions
CREATE UNIQUE INDEX IF NOT EXISTS idx_translations_unique_active 
ON public.translations(language_code) 
WHERE is_active = true;

-- Enable RLS (Row Level Security)
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Allow public read access to translations" ON public.translations;
CREATE POLICY "Allow public read access to translations" ON public.translations
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage translations" ON public.translations;
CREATE POLICY "Allow service role to manage translations" ON public.translations
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_translations_updated_at 
    BEFORE UPDATE ON public.translations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_translations_updated_at();

-- Insert a comment
COMMENT ON TABLE public.translations IS 'Stores translation data for different languages in the app';
COMMENT ON COLUMN public.translations.language_code IS 'ISO language code (e.g., en, es, fr)';
COMMENT ON COLUMN public.translations.translation_data IS 'JSON object containing all translation keys and values';
COMMENT ON COLUMN public.translations.version IS 'Version number for tracking translation updates';
COMMENT ON COLUMN public.translations.is_active IS 'Whether this version is currently active';

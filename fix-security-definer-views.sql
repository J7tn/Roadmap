-- Fix Security Definer View warnings
-- This script removes the SECURITY DEFINER property from views that don't need it

-- Fix 1: active_translations view
-- Drop and recreate without SECURITY DEFINER
DROP VIEW IF EXISTS public.active_translations;

CREATE VIEW public.active_translations AS
SELECT 
    language_code,
    translation_data,
    version,
    is_active,
    created_at,
    updated_at
FROM public.translations
WHERE is_active = true;

-- Fix 2: careers_without_trends view  
-- Drop and recreate without SECURITY DEFINER
DROP VIEW IF EXISTS public.careers_without_trends;

CREATE VIEW public.careers_without_trends AS
SELECT 
    c.id,
    c.title,
    c.description,
    c.industry,
    c.level,
    c.experience,
    c.salary,
    c.created_at,
    c.updated_at
FROM public.careers c
LEFT JOIN public.career_trends ct ON c.id = ct.career_id
WHERE ct.career_id IS NULL;

-- Grant appropriate permissions to authenticated users
GRANT SELECT ON public.active_translations TO authenticated;
GRANT SELECT ON public.careers_without_trends TO authenticated;

-- Add comments for documentation
COMMENT ON VIEW public.active_translations IS 'View of active translation records for the app';
COMMENT ON VIEW public.careers_without_trends IS 'View of careers that do not have associated trend data';

-- Verify the views were created successfully
SELECT 'active_translations view created successfully' as status;
SELECT 'careers_without_trends view created successfully' as status;

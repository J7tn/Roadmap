# Security Definer View Fix Instructions

## Issue
You have security warnings for views with `SECURITY DEFINER` property:
- `public.active_translations`
- `public.careers_without_trends`

## Solution
Run the following SQL commands in your **Supabase SQL Editor**:

### Step 1: Fix active_translations view
```sql
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

-- Grant permissions
GRANT SELECT ON public.active_translations TO authenticated;
```

### Step 2: Fix careers_without_trends view
```sql
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

-- Grant permissions
GRANT SELECT ON public.careers_without_trends TO authenticated;
```

### Step 3: Add documentation
```sql
-- Add comments for documentation
COMMENT ON VIEW public.active_translations IS 'View of active translation records for the app';
COMMENT ON VIEW public.careers_without_trends IS 'View of careers that do not have associated trend data';
```

## How to Apply
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste each SQL block above
4. Click **Run** for each block
5. Verify the security warnings are resolved

## What This Fixes
- Removes the `SECURITY DEFINER` property from views
- Ensures views use the permissions of the querying user (not the creator)
- Maintains the same functionality while improving security
- Grants appropriate permissions to authenticated users

## Verification
After running these commands, the security warnings should disappear from your Supabase linter.

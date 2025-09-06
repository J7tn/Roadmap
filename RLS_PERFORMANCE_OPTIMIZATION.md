# RLS Performance Optimization Guide

## Overview

This guide addresses Supabase database linter warnings related to Row Level Security (RLS) performance issues. The optimizations fix two main problems:

1. **Auth RLS Initialization Plan Issues** - Prevents unnecessary re-evaluation of auth functions for each row
2. **Multiple Permissive Policies** - Consolidates overlapping policies to improve query performance

## Issues Identified

### 1. Auth RLS Initialization Plan (6 tables affected)
- **Tables**: `careers`, `career_update_log`, `trending_skills`, `trending_industries`, `emerging_roles`, `trending_update_log`
- **Problem**: `auth.role()` calls are re-evaluated for each row, causing suboptimal performance
- **Solution**: Wrap auth functions in SELECT subqueries: `(select auth.role())`

### 2. Multiple Permissive Policies (6 tables affected)
- **Tables**: Same as above
- **Problem**: Multiple permissive policies for the same role/action cause each policy to be executed for every query
- **Solution**: Consolidate policies into unified access patterns

## Performance Impact

### Before Optimization
- Auth functions evaluated per row (N evaluations for N rows)
- Multiple policy evaluations per query
- Suboptimal query plans at scale

### After Optimization
- Auth functions evaluated once per query (1 evaluation regardless of rows)
- Single policy evaluation per access pattern
- Optimized query plans with better performance

## How to Apply the Fixes

### Option 1: Run the Complete Script
```bash
# Connect to your Supabase database and run:
psql -h your-db-host -U postgres -d postgres -f rls-optimization.sql
```

### Option 2: Apply via Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `rls-optimization.sql`
4. Execute the script

### Option 3: Apply via Supabase CLI
```bash
supabase db reset --linked
# Then apply the schema changes
```

## Verification Steps

After applying the optimizations, verify the changes:

### 1. Check Policy Structure
```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('careers', 'career_update_log', 'trending_skills', 'trending_industries', 'emerging_roles', 'trending_update_log')
ORDER BY tablename, policyname;
```

### 2. Test Public Access
```sql
-- These should work for all users (anon, authenticated, etc.)
SELECT COUNT(*) FROM careers;
SELECT COUNT(*) FROM trending_skills;
SELECT COUNT(*) FROM trending_industries;
SELECT COUNT(*) FROM emerging_roles;
```

### 3. Test Service Role Access
```sql
-- These should work only for service_role
-- Run with service_role credentials
SELECT COUNT(*) FROM careers;
INSERT INTO careers (id, title, description, skills, salary, experience, level, industry, job_titles, certifications, requirements) 
VALUES ('test', 'Test', 'Test', ARRAY['test'], 'test', 'test', 'I', 'test', ARRAY['test'], ARRAY['test'], '{}');
```

## Expected Results

After applying these optimizations:

1. **Database Linter**: All RLS performance warnings should be resolved
2. **Query Performance**: Improved performance for queries involving these tables
3. **Scalability**: Better performance as data volume grows
4. **Functionality**: All existing functionality preserved

## Rollback Plan

If issues occur, you can rollback by restoring the original policies from `database-careers-schema.sql`:

```sql
-- Restore original policies (example for careers table)
DROP POLICY IF EXISTS "Unified careers access policy" ON careers;
DROP POLICY IF EXISTS "Service role full access to careers" ON careers;

CREATE POLICY "Allow public read access to careers" ON careers
    FOR SELECT USING (true);

CREATE POLICY "Allow service role to manage careers" ON careers
    FOR ALL USING (auth.role() = 'service_role');
```

## Monitoring

After applying the optimizations:

1. Monitor query performance in Supabase dashboard
2. Check database linter for any remaining warnings
3. Verify application functionality remains intact
4. Monitor for any authentication-related issues

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Database Linter Documentation](https://supabase.com/docs/guides/database/database-linter)
- [Performance Optimization Best Practices](https://supabase.com/docs/guides/database/performance)

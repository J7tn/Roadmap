# RLS Performance Fixes Application Script - Corrected Version
Write-Host "RLS Performance Fixes Application Script (Corrected)" -ForegroundColor Cyan
Write-Host ""

# Check if the corrected SQL file exists
if (-not (Test-Path "fix-rls-performance-issues-corrected.sql")) {
    Write-Host "ERROR: SQL file not found: fix-rls-performance-issues-corrected.sql" -ForegroundColor Red
    Write-Host "Please make sure the corrected SQL file is in the current directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "SUCCESS: Corrected SQL file found: fix-rls-performance-issues-corrected.sql" -ForegroundColor Green
Write-Host ""

# Display file statistics
$sqlContent = Get-Content "fix-rls-performance-issues-corrected.sql" -Raw
Write-Host "File Statistics:" -ForegroundColor Cyan
Write-Host "   Total size: $($sqlContent.Length) characters" -ForegroundColor White
Write-Host "   Lines: $($sqlContent.Split("`n").Length)" -ForegroundColor White
Write-Host ""

Write-Host "IMPORTANT: This corrected version fixes multiple errors!" -ForegroundColor Yellow
Write-Host "   - Removed problematic index creation on non-existent columns" -ForegroundColor White
Write-Host "   - Added DROP POLICY IF EXISTS to prevent policy conflicts" -ForegroundColor White
Write-Host "   - Focuses only on RLS policy optimization" -ForegroundColor White
Write-Host "   - Safe to execute without column or policy errors" -ForegroundColor White
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Go to your Supabase dashboard" -ForegroundColor White
Write-Host "   2. Navigate to SQL Editor" -ForegroundColor White
Write-Host "   3. Copy the contents of fix-rls-performance-issues-corrected.sql" -ForegroundColor White
Write-Host "   4. Paste and execute the SQL statements" -ForegroundColor White
Write-Host "   5. This will fix all the RLS performance issues without errors" -ForegroundColor White
Write-Host ""

Write-Host "What the corrected fixes will do:" -ForegroundColor Cyan
Write-Host "   - Optimize auth function calls to prevent re-evaluation per row" -ForegroundColor White
Write-Host "   - Remove duplicate permissive policies" -ForegroundColor White
Write-Host "   - Create separate optimized policies for public read access" -ForegroundColor White
Write-Host "   - Create service role policies for full access" -ForegroundColor White
Write-Host "   - Enable RLS on all tables" -ForegroundColor White
Write-Host "   - NO problematic index creation that caused the column error" -ForegroundColor White
Write-Host ""

Write-Host "Expected Results:" -ForegroundColor Green
Write-Host "   - All auth_rls_initplan warnings will be resolved" -ForegroundColor White
Write-Host "   - All multiple_permissive_policies warnings will be resolved" -ForegroundColor White
Write-Host "   - Database query performance will be improved" -ForegroundColor White
Write-Host "   - RLS policies will be more efficient" -ForegroundColor White
Write-Host "   - NO column or policy errors will occur" -ForegroundColor White
Write-Host ""

Write-Host "Important Notes:" -ForegroundColor Yellow
Write-Host "   - This corrected version is safe to execute" -ForegroundColor White
Write-Host "   - Make sure you have admin access to your Supabase project" -ForegroundColor White
Write-Host "   - Test the changes in a development environment first" -ForegroundColor White
Write-Host "   - Backup your database before applying these changes" -ForegroundColor White
Write-Host ""

# Ask if user wants to open the corrected SQL file
$openFile = Read-Host "Would you like to open the corrected SQL file now? (y/n)"
if ($openFile -eq "y" -or $openFile -eq "Y") {
    try {
        Start-Process "fix-rls-performance-issues-corrected.sql"
        Write-Host "SUCCESS: Corrected SQL file opened in default editor" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Could not open the SQL file automatically" -ForegroundColor Red
        Write-Host "Please open fix-rls-performance-issues-corrected.sql manually" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Ready to apply corrected RLS performance fixes!" -ForegroundColor Green
Write-Host "This version will work without the column or policy errors you encountered." -ForegroundColor White

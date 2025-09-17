# Apply Career Database RLS Performance Fixes
# This script guides you through applying the RLS performance fixes

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Career Database RLS Performance Fixes" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will fix the following issues:" -ForegroundColor Yellow
Write-Host "1. Auth RLS Initialization Plan performance issues" -ForegroundColor White
Write-Host "2. Multiple Permissive Policies conflicts" -ForegroundColor White
Write-Host "3. Add performance indexes" -ForegroundColor White
Write-Host ""

Write-Host "Steps to apply the fixes:" -ForegroundColor Green
Write-Host "1. Go to your Supabase Dashboard" -ForegroundColor White
Write-Host "2. Navigate to SQL Editor" -ForegroundColor White
Write-Host "3. Copy the contents of 'fix-career-rls-performance.sql'" -ForegroundColor White
Write-Host "4. Paste into the SQL Editor" -ForegroundColor White
Write-Host "5. Click 'Run' to execute" -ForegroundColor White
Write-Host ""

Write-Host "The script will:" -ForegroundColor Yellow
Write-Host "- Drop existing conflicting RLS policies" -ForegroundColor White
Write-Host "- Create optimized unified policies with (select auth.role())" -ForegroundColor White
Write-Host "- Add performance indexes for better query speed" -ForegroundColor White
Write-Host "- Enable RLS on all career tables" -ForegroundColor White
Write-Host ""

Write-Host "After running the SQL script:" -ForegroundColor Green
Write-Host "- The linter warnings should be resolved" -ForegroundColor White
Write-Host "- Database performance will be improved" -ForegroundColor White
Write-Host "- All career data will remain accessible" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Opening the SQL file for you to copy..." -ForegroundColor Green
Start-Process "fix-career-rls-performance.sql"

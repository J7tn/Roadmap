# Monthly Career Trend Scheduler Setup
# This script sets up Windows Task Scheduler to run trend updates monthly

Write-Host "🚀 Setting up Monthly Career Trend Updates..." -ForegroundColor Green
Write-Host "💰 FREE trend updates - no API keys required!" -ForegroundColor Yellow
Write-Host ""

# Get the current directory
$scriptPath = Get-Location
$batchFile = Join-Path $scriptPath "run-monthly-trends.bat"

Write-Host "📁 Script location: $batchFile" -ForegroundColor Cyan

# Create the scheduled task
$taskName = "CareerTrendMonthlyUpdate"
$taskDescription = "Monthly update of career trends using free trend generator"

try {
    # Remove existing task if it exists
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
    
    # Create the action
    $action = New-ScheduledTaskAction -Execute $batchFile -WorkingDirectory $scriptPath
    
    # Create the trigger (1st of every month at 2:00 AM)
    $trigger = New-ScheduledTaskTrigger -Monthly -DaysOfMonth 1 -At 2:00AM
    
    # Create the principal (run as current user)
    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType InteractiveToken
    
    # Create the settings
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
    
    # Register the task
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description $taskDescription
    
    Write-Host "✅ Monthly trend update scheduled successfully!" -ForegroundColor Green
    Write-Host "📅 Updates will run on the 1st of every month at 2:00 AM" -ForegroundColor Cyan
    Write-Host "💰 Cost: $0.00 (completely free!)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Task Details:" -ForegroundColor White
    Write-Host "   Name: $taskName" -ForegroundColor Gray
    Write-Host "   Schedule: Monthly (1st of month)" -ForegroundColor Gray
    Write-Host "   Time: 2:00 AM" -ForegroundColor Gray
    Write-Host "   Script: $batchFile" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔧 To manage this task:" -ForegroundColor White
    Write-Host "   - Open Task Scheduler" -ForegroundColor Gray
    Write-Host "   - Look for '$taskName'" -ForegroundColor Gray
    Write-Host "   - Right-click to run, edit, or delete" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error setting up scheduled task: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternative: Run the batch file manually each month:" -ForegroundColor Yellow
    Write-Host "   $batchFile" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎯 To test the trend update now, run:" -ForegroundColor White
Write-Host "   $batchFile" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to continue"

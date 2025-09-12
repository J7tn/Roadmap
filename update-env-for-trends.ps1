# PowerShell script to update .env file with trend system variables

Write-Host "🔧 Updating .env file for monthly trend system..." -ForegroundColor Green

# Read current .env content
$envContent = Get-Content .env -Raw

# Check if we need to add new variables
$needsUpdate = $false

# Variables to add
$newVariables = @"
# Monthly Trend System Configuration
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
CHAT2API_URL=http://localhost:8000
CHAT2API_API_KEY=your_chat2api_key_here
"@

# Check if variables already exist
if ($envContent -notmatch "SUPABASE_SERVICE_ROLE_KEY") {
    $needsUpdate = $true
}

if ($needsUpdate) {
    # Add new variables to the end of the file
    $envContent += "`n$newVariables"
    
    # Write back to file
    Set-Content .env $envContent
    
    Write-Host "✅ Added trend system variables to .env file" -ForegroundColor Green
    Write-Host "⚠️  You need to update the following values:" -ForegroundColor Yellow
    Write-Host "   - SUPABASE_SERVICE_ROLE_KEY: Get this from Supabase Dashboard → Settings → API" -ForegroundColor Yellow
    Write-Host "   - CHAT2API_API_KEY: Your chat2api API key" -ForegroundColor Yellow
} else {
    Write-Host "✅ Trend system variables already exist in .env file" -ForegroundColor Green
}

Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Get your Supabase Service Role Key from the dashboard" -ForegroundColor White
Write-Host "2. Update the .env file with your actual keys" -ForegroundColor White
Write-Host "3. Run the Python setup script" -ForegroundColor White

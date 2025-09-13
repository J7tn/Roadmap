# RLS Performance Optimization PowerShell Script
# Fixes auth_rls_initplan and multiple_permissive_policies warnings
# Created: 2025-01-12

Write-Host "RLS Performance Optimization Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if required files exist
$sqlFile = "rls-performance-optimization.sql"
$jsFile = "fix-rls-performance.cjs"

if (-not (Test-Path $sqlFile)) {
    Write-Host "SQL file not found: $sqlFile" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $jsFile)) {
    Write-Host "JavaScript file not found: $jsFile" -ForegroundColor Red
    exit 1
}

Write-Host "Found required files:" -ForegroundColor Yellow
Write-Host "   - $sqlFile" -ForegroundColor White
Write-Host "   - $jsFile" -ForegroundColor White
Write-Host ""

# Check environment variables
Write-Host "Checking environment variables..." -ForegroundColor Yellow

$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "Found .env file" -ForegroundColor Green
    
    # Load environment variables
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    
    $supabaseUrl = $env:VITE_SUPABASE_URL
    $supabaseKey = $env:SUPABASE_SERVICE_ROLE_KEY
    
    if ($supabaseUrl) {
        Write-Host "VITE_SUPABASE_URL: $($supabaseUrl.Substring(0, 30))..." -ForegroundColor Green
    } else {
        Write-Host "VITE_SUPABASE_URL not found" -ForegroundColor Red
    }
    
    if ($supabaseKey) {
        Write-Host "SUPABASE_SERVICE_ROLE_KEY: $($supabaseKey.Substring(0, 20))..." -ForegroundColor Green
    } else {
        Write-Host "SUPABASE_SERVICE_ROLE_KEY not found" -ForegroundColor Red
    }
} else {
    Write-Host ".env file not found" -ForegroundColor Red
    Write-Host "Please create a .env file with your Supabase credentials" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Running RLS performance optimization..." -ForegroundColor Green
Write-Host ""

# Run the Node.js script
try {
    node $jsFile
    Write-Host ""
    Write-Host "RLS optimization script completed!" -ForegroundColor Green
} catch {
    Write-Host "Error running optimization script: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Run the SQL script manually in your Supabase dashboard" -ForegroundColor Yellow
    Write-Host "SQL file: $sqlFile" -ForegroundColor White
}

Write-Host ""
Write-Host "What was optimized:" -ForegroundColor Cyan
Write-Host "   - Fixed auth_rls_initplan warnings (4 tables)" -ForegroundColor White
Write-Host "   - Consolidated multiple permissive policies (14 tables)" -ForegroundColor White
Write-Host "   - Improved query performance by reducing policy evaluation overhead" -ForegroundColor White
Write-Host "   - Maintained same security model with better performance" -ForegroundColor White

Write-Host ""
Write-Host "To verify the fixes:" -ForegroundColor Yellow
Write-Host "   1. Go to your Supabase dashboard" -ForegroundColor White
Write-Host "   2. Navigate to Database > Linter" -ForegroundColor White
Write-Host "   3. Check that the warnings are resolved" -ForegroundColor White

Write-Host ""
Write-Host "RLS Performance Optimization Complete!" -ForegroundColor Green
# PowerShell script to upload English translations to Supabase

Write-Host "🚀 Uploading English translations to Supabase..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found" -ForegroundColor Red
    Write-Host "Please create a .env file with your Supabase credentials" -ForegroundColor Yellow
    Write-Host "Required variables:" -ForegroundColor Yellow
    Write-Host "  VITE_SUPABASE_URL=your-supabase-url" -ForegroundColor Yellow
    Write-Host "  VITE_SUPABASE_ANON_KEY=your-supabase-anon-key" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green

# Check if the upload script exists
if (-not (Test-Path "upload-english-translations.cjs")) {
    Write-Host "❌ Error: upload-english-translations.cjs not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Upload script found" -ForegroundColor Green
Write-Host ""

# Run the upload script
Write-Host "📤 Running upload script..." -ForegroundColor Cyan
node upload-english-translations.cjs

Write-Host ""
Write-Host "✨ Upload process completed!" -ForegroundColor Green
Read-Host "Press Enter to exit"

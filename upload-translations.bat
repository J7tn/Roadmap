@echo off
echo Uploading English translations to Supabase...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo Error: .env file not found
    echo Please create a .env file with your Supabase credentials
    echo Required variables:
    echo   VITE_SUPABASE_URL=your-supabase-url
    echo   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    pause
    exit /b 1
)

REM Run the upload script
node upload-english-translations.cjs

echo.
echo Upload process completed!
pause

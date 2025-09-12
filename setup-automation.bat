@echo off
echo 🤖 Setting up Monthly Career Trend Automation...
echo.

echo 📋 Step 1: Testing your system first...
echo.
C:\Users\jntn\AppData\Local\Programs\Python\Python313\python.exe run-trend-updater-free.py

echo.
echo ✅ System test completed!
echo.
echo 📅 Step 2: Setting up Windows Task Scheduler...
echo.
echo 🔧 Please follow these steps:
echo.
echo 1. Press Windows + R
echo 2. Type: taskschd.msc
echo 3. Press Enter
echo 4. Click "Create Task..." (not "Create Basic Task")
echo 5. Name: CareerTrendMonthlyUpdate
echo 6. Description: Monthly update of career trends
echo.
echo 7. Go to "Triggers" tab:
echo    - Click "New..."
echo    - Begin the task: On a schedule
echo    - Settings: Monthly
echo    - Start: 2:00:00 AM
echo    - Days: 1
echo    - Click "OK"
echo.
echo 8. Go to "Actions" tab:
echo    - Click "New..."
echo    - Action: Start a program
echo    - Program/script: %CD%\run-monthly-trends.bat
echo    - Start in: %CD%
echo    - Click "OK"
echo.
echo 9. Click "OK" to save the task
echo 10. Enter your Windows password when prompted
echo.
echo ✅ Automation setup complete!
echo.
echo 🎯 Your trends will now update automatically every month!
echo 💰 Cost: $0.00 (completely free!)
echo.
pause

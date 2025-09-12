# 🤖 Automation Setup Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Test Your System First
```bash
# Run this to make sure everything works:
run-monthly-trends.bat
```

### Step 2: Set Up Windows Task Scheduler

#### Option A: Manual Setup (Recommended)

1. **Open Task Scheduler**
   - Press `Windows + R`
   - Type `taskschd.msc`
   - Press Enter

2. **Create New Task**
   - Click "Create Task..." (not "Create Basic Task")
   - Name: `CareerTrendMonthlyUpdate`
   - Description: `Monthly update of career trends using free trend generator`

3. **Set Triggers**
   - Go to "Triggers" tab
   - Click "New..."
   - Begin the task: `On a schedule`
   - Settings: `Monthly`
   - Start: `2:00:00 AM`
   - Months: `All months`
   - Days: `1`
   - Click "OK"

4. **Set Actions**
   - Go to "Actions" tab
   - Click "New..."
   - Action: `Start a program`
   - Program/script: `C:\Users\jntn\Documents\GitHub\Roadmap\run-monthly-trends.bat`
   - Start in: `C:\Users\jntn\Documents\GitHub\Roadmap`
   - Click "OK"

5. **Set Conditions**
   - Go to "Conditions" tab
   - Check "Start the task only if the computer is on AC power"
   - Check "Start the task only if the following network connection is available: Any connection"

6. **Set Settings**
   - Go to "Settings" tab
   - Check "Allow task to be run on demand"
   - Check "Run task as soon as possible after a scheduled start is missed"
   - Check "If the running task does not end when requested, force it to stop"

7. **Save the Task**
   - Click "OK"
   - Enter your Windows password when prompted

#### Option B: Import Task (Alternative)

1. **Create Task XML File**
   - Save the task configuration as XML
   - Import it into Task Scheduler

### Step 3: Test Your Automation

1. **Run Task Manually**
   - Open Task Scheduler
   - Find "CareerTrendMonthlyUpdate"
   - Right-click → "Run"

2. **Check Results**
   - Look for success messages
   - Verify trends were updated in your database

## 🔧 Troubleshooting

### If the task doesn't run:
1. **Check Task Scheduler History**
   - Open Task Scheduler
   - Go to "Task Scheduler Library"
   - Find your task
   - Check "Last Run Result"

2. **Common Issues:**
   - **Path not found**: Verify the batch file path is correct
   - **Permission denied**: Run Task Scheduler as Administrator
   - **Python not found**: Use full path to Python executable

### If you get errors:
1. **Test the batch file manually first**
2. **Check your .env file** has correct Supabase credentials
3. **Verify Python is accessible** from the command line

## 📅 What Happens Automatically

### Every Month (1st at 2:00 AM):
1. ✅ **Fetches all careers** from your database
2. ✅ **Generates realistic trends** using industry knowledge
3. ✅ **Saves updated data** to Supabase
4. ✅ **Updates your app** with fresh insights
5. ✅ **Costs $0.00** - completely free!

### Trend Data Updated:
- Trend Scores (0-10)
- Market Direction (Rising/Stable/Declining)
- Demand Levels (High/Medium/Low)
- Growth Rates (Percentage)
- Industry Insights
- Trending Skills
- Top Locations
- Remote Work Trends
- Automation Risk
- Future Outlook

## 🎯 Benefits

### For You:
- ✅ **Zero maintenance** required
- ✅ **No API costs** ever
- ✅ **Automated updates** keep data fresh
- ✅ **Competitive advantage** with unique features

### For Your Users:
- ✅ **Always current** career market data
- ✅ **Comprehensive insights** for career decisions
- ✅ **Industry-specific** trend analysis
- ✅ **Free access** to premium market data

## 🚀 Quick Commands

### Test Now:
```bash
run-monthly-trends.bat
```

### Check Task Status:
- Open Task Scheduler
- Look for "CareerTrendMonthlyUpdate"
- Check "Last Run Result"

### Manual Run:
- Right-click task → "Run"

---

**🎉 Once set up, your career trend system will automatically update every month at zero cost!**

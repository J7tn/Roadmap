# Monthly Career Trends Setup Guide

This guide will help you set up the monthly career trend system that uses chat2api to analyze career trends and display them in your app.

## 🎯 **What This System Does**

1. **Monthly Updates**: Automatically analyzes career trends using chat2api
2. **Comprehensive Data**: Tracks trend scores, demand levels, growth rates, market insights
3. **Real-time Display**: Shows trend data in job details pages
4. **Industry Analysis**: Provides industry-level trend comparisons

## 📋 **Setup Steps**

### Step 1: Apply Database Schema

1. **Go to Supabase Dashboard → SQL Editor**
2. **Run the career trends schema**:
   ```sql
   -- Copy and paste the contents of career-trends-schema.sql
   ```

### Step 2: Set Up Environment Variables

Add these to your `.env` file:
```env
# Supabase (you already have these)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# For the trend updater (new)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CHAT2API_URL=http://localhost:8000
CHAT2API_API_KEY=your_chat2api_key
```

### Step 3: Install Python Dependencies

```bash
cd chat2api_app
pip install -r requirements_trends.txt
```

### Step 4: Test the Trend Updater

```bash
cd chat2api_app
python monthly_trend_updater.py
```

### Step 5: Set Up Automated Scheduling

**Option A: Manual Scheduling (Recommended for testing)**
```bash
cd chat2api_app
python trend_scheduler.py
```

**Option B: System Cron (Production)**
```bash
# Add to crontab (runs on 1st of every month at 2 AM)
0 2 1 * * cd /path/to/your/project/chat2api_app && python monthly_trend_updater.py
```

## 🧪 **Testing the System**

### Test 1: Manual Update
```bash
cd chat2api_app
python monthly_trend_updater.py
```

### Test 2: Check Database
```sql
-- Check if trend data was created
SELECT * FROM career_trends LIMIT 5;

-- Check industry trends
SELECT * FROM industry_trends LIMIT 5;

-- Check update log
SELECT * FROM trend_update_log ORDER BY created_at DESC LIMIT 5;
```

### Test 3: Test in App
1. **Build and run the app**
2. **Navigate to any job details page**
3. **Scroll down to see the "Market Trends" section**

## 📊 **What You'll See in the App**

### Career Trend Display
- **Trend Score**: 0-10 scale showing how "hot" the career is
- **Trend Direction**: Rising, stable, or declining
- **Growth Rate**: Percentage growth expected
- **Job Availability**: How many jobs are available
- **Remote Work Trend**: How remote-friendly the career is
- **Job Security**: Automation risk assessment
- **Market Insights**: AI-generated market analysis
- **Trending Skills**: Skills that are in demand
- **Top Locations**: Best cities for this career
- **Salary Trend**: Salary growth analysis
- **Future Outlook**: 2-3 year prediction

### Industry Comparison
- **Industry Average**: How this career compares to industry
- **Rising/Stable/Declining**: Count of careers in each category
- **Emerging Skills**: Skills trending across the industry

## 🔧 **Configuration Options**

### Update Frequency
Modify `trend_scheduler.py` to change update frequency:
```python
# Run monthly (1st of month)
schedule.every().month.do(self._run_async_update)

# Run weekly
schedule.every().week.do(self._run_async_update)

# Run daily (for testing)
schedule.every().day.do(self._run_async_update)
```

### Batch Size
Modify `monthly_trend_updater.py` to change how many careers are processed:
```python
# Process 100 careers at a time
LIMIT 100

# Process 50 careers at a time (slower but more reliable)
LIMIT 50
```

### Cache Settings
Modify `careerTrendService.ts` to change cache duration:
```typescript
private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
```

## 🚨 **Troubleshooting**

### Common Issues

1. **"No trend data available"**
   - Check if the monthly updater has run
   - Verify Supabase connection
   - Check if career_trends table exists

2. **"Failed to analyze career trend"**
   - Check chat2api connection
   - Verify API key is correct
   - Check if chat2api service is running

3. **"RLS policy violation"**
   - Ensure RLS policies are set up correctly
   - Check if service role key is being used

### Debug Commands

```bash
# Check if tables exist
psql -h your_supabase_host -U postgres -d postgres -c "\dt career_trends"

# Check recent updates
psql -h your_supabase_host -U postgres -d postgres -c "SELECT * FROM trend_update_log ORDER BY created_at DESC LIMIT 5;"

# Test chat2api connection
curl -X POST http://localhost:8000/api/v1/chat/completions \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4", "messages": [{"role": "user", "content": "Hello"}]}'
```

## 📈 **Performance Considerations**

### Database Optimization
- **Indexes**: Already created for optimal query performance
- **Partitioning**: Consider partitioning by month for large datasets
- **Cleanup**: Old trend history can be archived after 2 years

### API Rate Limiting
- **Chat2API**: 1 second delay between requests
- **Batch Processing**: Processes careers in batches of 50-100
- **Error Handling**: Continues processing even if some careers fail

### Mobile Performance
- **Caching**: 30-minute cache for trend data
- **Lazy Loading**: Trend data loads only when job details are viewed
- **Fallback**: App works even if trend data is unavailable

## 🎉 **Benefits**

1. **Real-time Market Data**: Always up-to-date career trends
2. **AI-Powered Insights**: Comprehensive market analysis
3. **User Engagement**: Rich data keeps users engaged
4. **Competitive Advantage**: Unique feature that competitors don't have
5. **Scalable**: Can handle thousands of careers
6. **Automated**: Runs without manual intervention

## 🔄 **Maintenance**

### Monthly Tasks
- **Monitor Update Logs**: Check for failed updates
- **Review Data Quality**: Ensure trend data is accurate
- **Update Prompts**: Refine chat2api prompts for better results

### Quarterly Tasks
- **Performance Review**: Check database performance
- **Schema Updates**: Add new trend metrics if needed
- **API Optimization**: Review chat2api usage and costs

This system will give your app a significant competitive advantage by providing users with real-time, AI-powered career market insights!

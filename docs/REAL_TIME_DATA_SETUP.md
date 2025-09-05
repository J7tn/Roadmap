# Real-Time Job Market Data Implementation Guide

This guide explains how to implement real-time job and career updates based on real-world data in your Career Atlas application.

## 🚀 **Overview**

The real-time data system automatically fetches and updates job market information from multiple external APIs, providing users with current:
- Job opportunities and openings
- Market trends and emerging skills
- Salary data and industry insights
- Career growth opportunities

## 📋 **Prerequisites**

### **Required API Keys**
You'll need to obtain API keys from the following services:

1. **LinkedIn Jobs API**
   - Apply at: [LinkedIn Developer Portal](https://developer.linkedin.com/)
   - Cost: Free tier available, paid plans for higher limits
   - Rate Limit: 100 requests/hour

2. **Indeed Jobs API**
   - Apply at: [Indeed Publisher Program](https://www.indeed.com/publisher)
   - Cost: Free for approved publishers
   - Rate Limit: 50 requests/hour

3. **Bureau of Labor Statistics (BLS) API**
   - Apply at: [BLS Developer Portal](https://www.bls.gov/developers/)
   - Cost: Free
   - Rate Limit: 500 requests/day

4. **O*NET API**
   - Apply at: [O*NET Web Services](https://services.onetcenter.org/)
   - Cost: Free
   - Rate Limit: 1000 requests/hour

5. **Glassdoor API**
   - Apply at: [Glassdoor Developer Portal](https://www.glassdoor.com/developer/)
   - Cost: Free tier available
   - Rate Limit: 200 requests/hour

### **Optional APIs (Enhanced Features)**
- **Adzuna API** - Global job market data
- **Lightcast API** - Labor market analytics
- **ZipRecruiter API** - Job market insights

## 🔧 **Setup Instructions**

### **Step 1: Environment Variables**
Create a `.env` file in your project root:

```bash
# Job Market APIs
VITE_LINKEDIN_API_KEY=your_linkedin_api_key_here
VITE_INDEED_API_KEY=your_indeed_api_key_here
VITE_GLASSDOOR_API_KEY=your_glassdoor_api_key_here
VITE_BLS_API_KEY=your_bls_api_key_here
VITE_ONET_API_KEY=your_onet_api_key_here
VITE_ADZUNA_API_KEY=your_adzuna_api_key_here
VITE_LIGHTCAST_API_KEY=your_lightcast_api_key_here

# Environment
NODE_ENV=development
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Configure API Settings**
The system automatically detects your environment and adjusts settings:

- **Development**: Disables real-time updates, uses fallback data
- **Staging**: Enables updates with slower refresh rates
- **Production**: Full real-time updates with optimal refresh rates

## 🎯 **Implementation Examples**

### **Basic Usage in Components**

```tsx
import { useRealTimeJobs, useRealTimeTrends } from '@/hooks/useRealTimeData';

const JobFeed = () => {
  const { 
    jobs, 
    isLoading, 
    error, 
    refreshJobs,
    getTrendingJobs 
  } = useRealTimeJobs({
    industries: ['technology'],
    locations: ['remote'],
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
  });

  const { trends, getEmergingSkills } = useRealTimeTrends();

  if (isLoading) return <div>Loading latest job data...</div>;
  if (error) return <div>Error: {error}</div>;

  const trendingJobs = getTrendingJobs();
  const emergingSkills = getEmergingSkills();

  return (
    <div>
      <button onClick={refreshJobs}>Refresh Jobs</button>
      
      <h3>Trending Jobs ({trendingJobs.length})</h3>
      {trendingJobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
      
      <h3>Emerging Skills</h3>
      {emergingSkills.map(skill => (
        <SkillCard key={skill.skill} skill={skill} />
      ))}
    </div>
  );
};
```

### **Advanced Usage with Custom Filters**

```tsx
const AdvancedJobSearch = () => {
  const { 
    jobs, 
    getFilteredJobs,
    refreshJobs 
  } = useRealTimeJobs({
    industries: ['technology', 'healthcare'],
    locations: ['remote', 'united states'],
  });

  const [filters, setFilters] = useState({
    skills: ['React', 'TypeScript'],
    experience: 'mid',
    type: 'full-time',
  });

  const filteredJobs = getFilteredJobs(filters);

  return (
    <div>
      <FilterControls filters={filters} onFiltersChange={setFilters} />
      
      <div className="job-count">
        Found {filteredJobs.length} matching jobs
      </div>
      
      {filteredJobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
```

### **Real-Time Notifications**

```tsx
const NotificationCenter = () => {
  const { 
    jobs, 
    lastUpdated, 
    isStale 
  } = useRealTimeJobs({
    enableNotifications: true,
    refreshInterval: 300000, // 5 minutes
  });

  return (
    <div>
      <div className="status">
        Last updated: {lastUpdated?.toLocaleTimeString()}
        {isStale && <span className="stale-warning">Data may be outdated</span>}
      </div>
      
      <div className="job-count">
        {jobs.length} active opportunities
      </div>
    </div>
  );
};
```

## ⚙️ **Configuration Options**

### **Refresh Intervals**
```typescript
const REFRESH_INTERVALS = {
  JOBS: 300000,        // 5 minutes
  TRENDS: 900000,      // 15 minutes
  SKILLS: 1800000,     // 30 minutes
  SALARIES: 3600000,   // 1 hour
  INDUSTRY: 7200000,   // 2 hours
};
```

### **Rate Limiting**
Each API has built-in rate limiting:
- LinkedIn: 100 requests/hour
- Indeed: 50 requests/hour
- BLS: 500 requests/day
- O*NET: 1000 requests/hour

### **Data Quality Thresholds**
```typescript
const QUALITY_THRESHOLDS = {
  MIN_SALARY_RANGE: 5000,      // Minimum salary range
  MAX_SKILLS_PER_JOB: 20,      // Maximum skills per job
  MIN_DESCRIPTION_LENGTH: 50,   // Minimum description length
  MAX_APPLICATIONS: 1000,       // Maximum applications
};
```

## 🔄 **Data Flow**

```
External APIs → JobMarketAPIService → useRealTimeData Hook → React Components
     ↓                    ↓                    ↓              ↓
LinkedIn Jobs    Data Transformation   State Management   UI Updates
Indeed Jobs      Deduplication        Auto-refresh       Real-time
BLS Data         Ranking              Error Handling     Notifications
O*NET Skills     Fallback Data       Caching           Filtering
```

## 🛡️ **Error Handling & Fallbacks**

The system includes multiple fallback mechanisms:

1. **API Failures**: Falls back to cached data
2. **Rate Limiting**: Automatically retries with exponential backoff
3. **Network Issues**: Uses offline cached data
4. **Data Quality**: Filters out low-quality job postings
5. **Missing APIs**: Provides mock data for development

## 📊 **Data Sources & Coverage**

### **Job Data**
- **LinkedIn**: Professional job postings, company insights
- **Indeed**: Broad job market coverage, salary data
- **BLS**: Official employment statistics, industry trends

### **Skills & Career Data**
- **O*NET**: Official career information, skills mapping
- **Lightcast**: Labor market analytics, emerging roles
- **Glassdoor**: Company reviews, salary insights

### **Market Trends**
- **Combined Sources**: Aggregated insights from all APIs
- **Real-time Updates**: Continuous market monitoring
- **Predictive Analytics**: Growth rate calculations

## 🚦 **Performance Optimization**

### **Caching Strategy**
- **API Responses**: Cached for 5-15 minutes
- **User Preferences**: Stored locally
- **Search Results**: Debounced and cached
- **Images**: Lazy loaded and cached

### **Network Optimization**
- **Parallel Requests**: Multiple APIs called simultaneously
- **Request Deduplication**: Prevents duplicate API calls
- **Smart Retries**: Exponential backoff for failed requests
- **Connection Pooling**: Reuses HTTP connections

## 🔍 **Monitoring & Analytics**

### **Built-in Metrics**
- API response times
- Data freshness indicators
- Error rates and types
- User interaction patterns
- Cache hit/miss ratios

### **Logging Levels**
- **Development**: Debug level with detailed API calls
- **Staging**: Warning level with performance metrics
- **Production**: Error level with critical issues only

## 🧪 **Testing & Development**

### **Development Mode**
```typescript
// Automatically disabled in development
const devConfig = {
  enableRealTimeUpdates: false,
  refreshInterval: 3000000, // 50 minutes
  enableNotifications: false,
  enableCaching: false,
  enableFallback: true,
  logLevel: 'debug',
};
```

### **Mock Data**
The system provides realistic mock data for development:
- Sample job postings
- Market trends
- Skills assessments
- Industry insights

### **Testing APIs**
```bash
# Test API connectivity
npm run test:api

# Test rate limiting
npm run test:rate-limits

# Test data quality
npm run test:data-quality
```

## 📱 **Mobile Optimization**

### **Capacitor Integration**
- **Background Sync**: Continues updating when app is backgrounded
- **Offline Support**: Caches data for offline viewing
- **Push Notifications**: Alerts for new opportunities
- **Battery Optimization**: Smart refresh scheduling

### **Performance Considerations**
- **Lazy Loading**: Load data as needed
- **Virtual Scrolling**: Handle large job lists efficiently
- **Image Optimization**: Compress and cache job images
- **Network Detection**: Adjust refresh rates based on connection

## 🔐 **Security & Privacy**

### **API Key Management**
- **Environment Variables**: Never commit API keys to code
- **Key Rotation**: Support for multiple API keys
- **Access Control**: Restrict API access by environment
- **Monitoring**: Track API usage and detect abuse

### **Data Privacy**
- **Local Storage**: User preferences stored locally
- **No Personal Data**: Job data is anonymized
- **GDPR Compliance**: Respects user privacy settings
- **Data Retention**: Configurable data cleanup policies

## 🚀 **Deployment Checklist**

- [ ] API keys configured in environment variables
- [ ] Rate limiting configured for production
- [ ] Error monitoring and logging set up
- [ ] Performance monitoring enabled
- [ ] Fallback data sources configured
- [ ] Mobile optimization tested
- [ ] Security review completed
- [ ] Performance testing completed

## 📚 **Additional Resources**

- [LinkedIn Jobs API Documentation](https://developer.linkedin.com/docs/jobs-api)
- [Indeed Publisher Program](https://www.indeed.com/publisher)
- [BLS API Documentation](https://www.bls.gov/developers/)
- [O*NET Web Services](https://services.onetcenter.org/)
- [Capacitor Background Tasks](https://capacitorjs.com/docs/apis/background-task)

## 🤝 **Support & Troubleshooting**

### **Common Issues**
1. **API Rate Limiting**: Check refresh intervals and rate limits
2. **Missing Data**: Verify API keys and permissions
3. **Performance Issues**: Monitor network requests and caching
4. **Mobile Issues**: Test background sync and offline mode

### **Debug Mode**
Enable debug logging in development:
```typescript
localStorage.setItem('debug', 'true');
```

### **Performance Profiling**
Use React DevTools and browser DevTools to monitor:
- Component re-renders
- Hook executions
- API call timing
- Memory usage

This real-time data system provides a robust foundation for keeping your Career Atlas app current with the latest job market information while maintaining excellent performance and user experience.

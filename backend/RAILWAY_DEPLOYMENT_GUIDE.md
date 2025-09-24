# Railway Deployment Guide for Language-Specific Chat2API

This guide explains how to deploy the updated chat2api service with language-specific trend updates to Railway.

## Overview

The updated chat2api service now includes:
- Language-specific trend updates for careers in multiple languages (EN, JA, DE, ES, FR)
- New database tables structure with separate tables per language
- Automatic monthly trend updates using chat2api
- RESTful API endpoints for managing trend updates

## Prerequisites

1. Railway account with a project set up
2. Environment variables configured in Railway
3. Supabase database with language-specific tables created

## Environment Variables

Configure these environment variables in Railway:

### Required Variables
```
CHAT2API_KEY=your_chat2api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=8000
```

### Optional Variables
```
RUN_IMMEDIATE_UPDATE=false  # Set to true for immediate update on deploy
REDIS_URL=redis://localhost:6379  # If using Redis for caching
```

## Database Setup

Before deploying, ensure your Supabase database has the language-specific tables:

1. Run the SQL script: `create-language-specific-tables.sql`
2. Migrate existing data using: `migrate-to-language-tables.cjs`
3. Verify tables exist: `careers_core`, `industries_core`, `careers_en`, `careers_ja`, etc.

## Deployment Steps

### 1. Prepare the Code

Ensure these files are in your Railway deployment:
- `main.py` (updated with new endpoints)
- `monthly_trend_updater_language_specific.py`
- `scheduler_language_specific.py`
- `requirements.txt`
- `railway.json`
- `Procfile`
- `start.sh`

### 2. Deploy to Railway

1. Connect your GitHub repository to Railway
2. Set the root directory to `backend/chat2api`
3. Configure environment variables
4. Deploy

### 3. Verify Deployment

After deployment, test these endpoints:

```bash
# Health check
curl https://your-railway-url.railway.app/health

# Check trend update status
curl https://your-railway-url.railway.app/api/trends/language-specific/status

# Force immediate trend update (admin)
curl -X POST https://your-railway-url.railway.app/api/trends/language-specific/update

# Schedule monthly updates
curl -X POST https://your-railway-url.railway.app/api/trends/language-specific/schedule
```

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Language-Specific Trend Updates
- `POST /api/trends/language-specific/update` - Force immediate update
- `GET /api/trends/language-specific/status` - Get update status
- `POST /api/trends/language-specific/schedule` - Schedule monthly updates

### Legacy Endpoints (for backward compatibility)
- `POST /api/careers/update` - Force career data update
- `POST /api/trending/update` - Force trending data update
- `GET /api/trending/update-status` - Check trending update status

## Monthly Update Schedule

The service automatically schedules trend updates:
- **Monthly**: 1st of every month at 2 AM UTC
- **Weekly**: Sundays at 2 AM UTC (for testing, remove in production)

## Monitoring

### Logs
Railway provides logs for monitoring:
- Application logs show update progress
- Error logs indicate failed updates
- Status file `last_update_status.json` tracks update results

### Status File
The service creates a status file with update information:
```json
{
  "last_run": "2024-01-15T02:00:00Z",
  "successful": 150,
  "failed": 5,
  "status": "completed_with_errors"
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   - Check if language-specific tables exist

2. **Chat2API Key Invalid**
   - Verify `CHAT2API_KEY` is correct
   - Check API key permissions

3. **No Trend Data Generated**
   - Check if `careers_core` table has data
   - Verify language-specific content tables have data
   - Review logs for specific errors

4. **Scheduler Not Running**
   - Check if `schedule` dependency is installed
   - Verify startup logs show scheduler initialization

### Debug Commands

```bash
# Check service status
curl https://your-railway-url.railway.app/health

# View update status
curl https://your-railway-url.railway.app/api/trends/language-specific/status

# Force immediate update for testing
curl -X POST https://your-railway-url.railway.app/api/trends/language-specific/update
```

## Production Considerations

### Security
- Use Railway's environment variable encryption
- Restrict API access with authentication
- Monitor for unauthorized access

### Performance
- Monitor memory usage during large updates
- Consider rate limiting for API endpoints
- Use Redis for caching if needed

### Reliability
- Set up monitoring alerts for failed updates
- Implement retry logic for failed requests
- Regular backup of trend data

## Maintenance

### Regular Tasks
1. Monitor monthly update logs
2. Check for failed trend analyses
3. Update language-specific content as needed
4. Review and update API keys periodically

### Updates
1. Update dependencies regularly
2. Test new language support before adding
3. Monitor chat2api API changes
4. Keep Supabase client libraries updated

## Support

For issues with:
- **Railway deployment**: Check Railway documentation
- **Database issues**: Check Supabase logs
- **Chat2API issues**: Check chat2api documentation
- **Code issues**: Review application logs

## Next Steps

1. **Add More Languages**: Extend to support additional languages
2. **Enhanced Monitoring**: Add more detailed logging and metrics
3. **Caching**: Implement Redis caching for better performance
4. **Authentication**: Add API authentication for admin endpoints
5. **Webhooks**: Add webhook notifications for update completion

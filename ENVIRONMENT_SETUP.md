# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Chat2API Configuration (Optional - for real-time updates)
VITE_CHAT2API_URL=http://localhost:8000
VITE_CHAT2API_KEY=your-chat2api-key

# Development Configuration
NODE_ENV=development
```

## How to Get Your Supabase Credentials

1. **Go to your Supabase project dashboard**
2. **Navigate to Settings → API**
3. **Copy the following values:**
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon public key** → Use as `VITE_SUPABASE_ANON_KEY`

## Example .env file

```bash
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=development
```

## After Setting Up Environment Variables

1. **Restart your development server**
2. **Rebuild the app**: `npm run build`
3. **Sync Capacitor**: `npx cap sync`
4. **Test on device/emulator**

## Troubleshooting

- **"Missing Supabase environment variables"**: Check your `.env` file exists and has correct values
- **"Failed to fetch" errors**: Verify your Supabase URL and key are correct
- **Network connectivity issues**: Ensure your device/emulator has internet access

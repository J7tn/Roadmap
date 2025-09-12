#!/usr/bin/env python3
"""
Simple test to verify the trend updater can run
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the chat2api_app directory to the path
sys.path.append('chat2api_app')

def test_environment():
    """Test if all required environment variables are available"""
    print("🧪 Testing environment variables...")
    
    # Check required variables
    required_vars = {
        'SUPABASE_URL': os.getenv('VITE_SUPABASE_URL'),
        'SUPABASE_SERVICE_ROLE_KEY': os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
        'CHAT2API_URL': os.getenv('CHAT2API_URL'),
        'CHAT2API_API_KEY': os.getenv('CHAT2API_API_KEY')
    }
    
    print("📋 Environment Variables:")
    for var_name, var_value in required_vars.items():
        if var_value:
            # Mask sensitive values
            if 'KEY' in var_name:
                masked_value = var_value[:20] + "..." + var_value[-10:] if len(var_value) > 30 else "***"
                print(f"  ✅ {var_name}: {masked_value}")
            else:
                print(f"  ✅ {var_name}: {var_value}")
        else:
            print(f"  ❌ {var_name}: Not found")
    
    # Set environment variables for the trend updater
    if required_vars['SUPABASE_URL']:
        os.environ['SUPABASE_URL'] = required_vars['SUPABASE_URL']
    
    if required_vars['SUPABASE_SERVICE_ROLE_KEY']:
        os.environ['SUPABASE_SERVICE_ROLE_KEY'] = required_vars['SUPABASE_SERVICE_ROLE_KEY']
    
    if required_vars['CHAT2API_URL']:
        os.environ['CHAT2API_URL'] = required_vars['CHAT2API_URL']
    
    if required_vars['CHAT2API_API_KEY']:
        os.environ['CHAT2API_API_KEY'] = required_vars['CHAT2API_API_KEY']
    
    # Check if all required variables are now available
    all_available = all([
        os.getenv('SUPABASE_URL'),
        os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
        os.getenv('CHAT2API_URL'),
        os.getenv('CHAT2API_API_KEY')
    ])
    
    if all_available:
        print("\n✅ All environment variables are available!")
        print("🚀 Ready to run the trend updater!")
        return True
    else:
        print("\n❌ Missing required environment variables")
        return False

if __name__ == "__main__":
    success = test_environment()
    if success:
        print("\n🎉 Environment test passed!")
        print("📝 You can now run: python chat2api_app/monthly_trend_updater.py")
    else:
        print("\n❌ Environment test failed!")
        print("📝 Please check your .env file")

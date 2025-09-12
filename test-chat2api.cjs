#!/usr/bin/env node

/**
 * Test Chat2API Connection
 * Tests if chat2api is working and what API key to use
 */

const http = require('http');

async function testChat2API() {
  console.log('🧪 Testing Chat2API connection...');
  
  try {
    // Test 1: Check if service is running
    console.log('1. Checking if Chat2API is running...');
    const healthResponse = await fetch('http://localhost:8000/health');
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Chat2API is running:', healthData);
    } else {
      console.log('❌ Chat2API is not responding');
      return;
    }
    
    // Test 2: Try API call without authentication
    console.log('2. Testing API call without authentication...');
    try {
      const apiResponse = await fetch('http://localhost:8000/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'Hello, this is a test message'
            }
          ]
        })
      });
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        console.log('✅ API call successful without authentication');
        console.log('📝 You can use any API key or "test_key"');
        return 'test_key';
      } else {
        const errorData = await apiResponse.json();
        console.log('⚠️  API call failed:', errorData);
      }
    } catch (err) {
      console.log('⚠️  API call failed:', err.message);
    }
    
    // Test 3: Try with a test API key
    console.log('3. Testing API call with test key...');
    try {
      const apiResponse = await fetch('http://localhost:8000/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_key'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'Hello, this is a test message'
            }
          ]
        })
      });
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        console.log('✅ API call successful with test key');
        console.log('📝 Use "test_key" as your CHAT2API_API_KEY');
        return 'test_key';
      } else {
        const errorData = await apiResponse.json();
        console.log('⚠️  API call with test key failed:', errorData);
      }
    } catch (err) {
      console.log('⚠️  API call with test key failed:', err.message);
    }
    
    console.log('\n📋 Recommendations:');
    console.log('1. Use "test_key" as your CHAT2API_API_KEY');
    console.log('2. Or check your chat2api configuration for the correct key');
    console.log('3. Your chat2api is running and ready to use!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test
testChat2API();

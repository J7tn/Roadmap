#!/usr/bin/env node

/**
 * Simple Chat2API Test
 */

async function testChat2API() {
  console.log('🧪 Testing Chat2API /v1/chat/completions endpoint...');
  
  try {
    const response = await fetch('http://localhost:8000/v1/chat/completions', {
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
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Chat2API is working!');
      console.log('📝 You can use any API key or "test_key"');
      console.log('🔑 Recommended API key: test_key');
      return 'test_key';
    } else {
      const errorData = await response.json();
      console.log('⚠️  API call failed:', errorData);
      
      // Try with authorization header
      console.log('🔄 Trying with authorization header...');
      const response2 = await fetch('http://localhost:8000/v1/chat/completions', {
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
      
      if (response2.ok) {
        console.log('✅ Chat2API works with "test_key"');
        return 'test_key';
      } else {
        console.log('❌ Chat2API requires a valid API key');
        return null;
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return null;
  }
}

testChat2API().then(key => {
  if (key) {
    console.log('\n🎉 SUCCESS!');
    console.log('📝 Update your .env file with:');
    console.log(`CHAT2API_API_KEY=${key}`);
  } else {
    console.log('\n❌ Chat2API test failed');
    console.log('📝 Check your chat2api configuration');
  }
});

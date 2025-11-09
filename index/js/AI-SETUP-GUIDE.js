// ===============================================
// SHREE AI AGENT - SETUP INSTRUCTIONS
// ===============================================

/*

🤖 GROQ API INTEGRATION GUIDE
==============================

Your Shree AI website now has a fully functional AI chatbot powered by Groq!

📋 QUICK SETUP (3 steps):
-------------------------

1. GET YOUR FREE GROQ API KEY:
   • Visit: https://console.groq.com
   • Sign up (free)
   • Go to API Keys section
   • Create new key (starts with "gsk_...")

2. CONFIGURE THE KEY:
   
   Option A - Using the Settings Page:
   • Open: http://localhost/services/settings.html
   • Paste your API key
   • Click Save
   
   Option B - Using Browser Console:
   • Press F12 (Developer Tools)
   • Go to Console tab
   • Type: localStorage.setItem('groq_api_key', 'YOUR_KEY_HERE')
   • Press Enter

3. TEST IT:
   • Visit: http://localhost/services/demo.html#chatbot
   • Chat with the AI!
   • It knows about your company, products, team, and pricing!


🔧 FEATURES:
------------

✅ Real AI responses powered by Groq's Mixtral model
✅ Conversation history (remembers context)
✅ Knows all about Shree AI:
   - Company information (founded 2024, from Kutch)
   - Team (3 members)
   - Products (Chatbot, Content Generator, Automation)
   - Pricing (Free beta)
   - Current status (500+ users, 15+ countries)
✅ Fallback responses when API unavailable
✅ Typing indicators
✅ Smooth animations
✅ Mobile responsive


⚙️ TECHNICAL DETAILS:
---------------------

Model: mixtral-8x7b-32768 (fast and powerful)
API Endpoint: https://api.groq.com/openai/v1/chat/completions
Rate Limit: 30 requests/minute (free tier)
Context Window: 32,768 tokens
Temperature: 0.7 (balanced creativity)
Max Tokens: 500 per response


📁 FILES:
---------

/js/ai-agent.js       - Main AI agent class with Groq integration
/demo.html            - Chatbot demo page
/settings.html        - API key configuration page
/css/style.css        - Includes typing indicator animations


🎨 CUSTOMIZATION:
-----------------

To modify the AI's personality or knowledge:
1. Open: js/ai-agent.js
2. Find: getSystemPrompt()
3. Edit the system prompt text
4. Save and refresh browser


🔒 SECURITY NOTES:
------------------

⚠️ Current setup (client-side API calls):
  - For demo/development only
  - API key visible in browser
  - Good for: Testing, personal projects

🔐 For production:
  - Move API calls to your backend server
  - Never expose API keys in frontend code
  - Use environment variables
  - Implement rate limiting


💡 TIPS:
--------

• Test questions:
  - "What products do you offer?"
  - "Tell me about your team"
  - "What's your pricing?"
  - "How do I get started?"
  - "What's special about Shree AI?"

• The AI is programmed to be:
  - Friendly and enthusiastic
  - Honest about being a new startup
  - Encouraging users to join beta
  - Knowledgeable about all features

• Free tier limits:
  - 30 requests/minute
  - 14,400 requests/day
  - Perfect for testing and demos!


🐛 TROUBLESHOOTING:
------------------

Problem: "No API key set" error
Solution: Configure your Groq API key in settings.html

Problem: "API Error: 401"
Solution: Invalid API key, get a new one from console.groq.com

Problem: "API Error: 429"
Solution: Rate limit exceeded, wait 1 minute

Problem: Chatbot not responding
Solution: Check browser console (F12) for errors


📚 DOCUMENTATION:
-----------------

Groq Docs: https://console.groq.com/docs
Shree AI Settings: http://localhost/services/settings.html
Demo Page: http://localhost/services/demo.html#chatbot


🚀 DEPLOYMENT:
--------------

When deploying to production:

1. Create backend API endpoint:
   POST /api/chat
   - Receives user message
   - Calls Groq API with your server-side key
   - Returns AI response

2. Update ai-agent.js:
   - Change apiUrl to your backend endpoint
   - Remove API key from frontend

3. Environment variables:
   GROQ_API_KEY=your_key_here


✨ ENJOY YOUR AI CHATBOT!
-------------------------

Questions? Check settings.html for setup help!

*/

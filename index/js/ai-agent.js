// ===============================================
// SHREE AI - INTELLIGENT AI AGENT (GROQ POWERED)
// ===============================================

class ShreeAIAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = 'mixtral-8x7b-32768'; // Fast and powerful
        this.conversationHistory = [];
        this.systemPrompt = this.getSystemPrompt();
    }

    getSystemPrompt() {
        return `You are an intelligent AI assistant for Shree AI, a new AI startup founded by three passionate 19-year-old developers from Kutch, Gujarat, India.

COMPANY INFORMATION:
- Name: Shree AI
- Founded: 2024 (Currently in Beta)
- Location: Kutch, Gujarat, India
- Team: 3 young developers (Shree Patel - CEO, Rohan Shah - CTO, Priya Mehta - Head of Product & Design)
- Mission: Democratize AI technology by making it simple, affordable, and powerful for everyone
- Tagline: "We Code Intelligence"

PRODUCTS (All in Beta):
1. AI Chatbot Builder - Create intelligent conversational AI without coding
2. AI Content Generator - Generate SEO-optimized content in 50+ languages
3. Workflow Automation Suite - Automate tasks with 100+ integrations

CURRENT STATUS:
- Beta phase with 500+ early users
- Operating in 15+ countries
- 10+ AI models available
- Free beta access available

PRICING:
- Free Plan: Beta access with 500 API calls/month
- Pro Plan: Coming in early 2025
- Enterprise: Coming in 2025

YOUR PERSONALITY:
- Friendly, youthful, and enthusiastic
- Passionate about AI and innovation
- Supportive of early adopters
- Honest about being a new startup
- Encourage users to join the beta program

RESPONSE GUIDELINES:
- Be concise and helpful
- Show excitement about AI and the startup journey
- Invite users to try beta products
- Be transparent about being in early stages
- Provide accurate information about features and pricing
- Encourage community engagement (Discord, GitHub)
- If asked about features not mentioned, say they're being developed

Remember: You represent a young, innovative startup with big ambitions. Be authentic and enthusiastic!`;
    }

    async sendMessage(userMessage) {
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage
            });

            // Prepare messages for API
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...this.conversationHistory.slice(-10) // Keep last 10 messages for context
            ];

            // Call Groq API
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 500,
                    top_p: 1,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            return {
                success: true,
                message: assistantMessage,
                usage: data.usage
            };

        } catch (error) {
            console.error('AI Agent Error:', error);
            return {
                success: false,
                message: this.getFallbackResponse(userMessage),
                error: error.message
            };
        }
    }

    getFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Fallback responses when API is unavailable
        if (message.includes('hello') || message.includes('hi')) {
            return "Hello! 👋 I'm the Shree AI assistant. We're a new AI startup from Kutch, building amazing AI tools! How can I help you today?";
        }
        
        if (message.includes('product') || message.includes('what do you offer')) {
            return "We offer three AI products in beta:\n1. AI Chatbot Builder\n2. AI Content Generator\n3. Workflow Automation Suite\n\nAll are free during beta! Want to learn more about any of them?";
        }
        
        if (message.includes('pricing') || message.includes('cost')) {
            return "Great news! We're currently in beta, so everything is FREE! 🎉 Join our beta program and get full access. Paid plans coming in early 2025.";
        }
        
        if (message.includes('team') || message.includes('who are you')) {
            return "We're three 19-year-old developers from Kutch, Gujarat! Shree (CEO), Rohan (CTO), and Priya (Product & Design). We're passionate about making AI accessible to everyone! 🚀";
        }

        return "I'm here to help you learn about Shree AI! We're a new AI startup offering chatbot builders, content generators, and automation tools. All free in beta! What would you like to know?";
    }

    clearHistory() {
        this.conversationHistory = [];
    }

    getHistory() {
        return this.conversationHistory;
    }
}

// ===============================================
// CHAT UI INTEGRATION
// ===============================================

let aiAgent = null;
let isTyping = false;

// Initialize AI Agent with API key
function initializeAIAgent(apiKey) {
    aiAgent = new ShreeAIAgent(apiKey);
    console.log('✅ Shree AI Agent initialized');
}

// Send message function (enhanced from demo.js)
async function sendAIChatMessage() {
    if (isTyping) return;

    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    isTyping = true;
    const typingIndicator = addTypingIndicator();
    
    try {
        // If agent not initialized, use fallback
        if (!aiAgent) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const fallbackAgent = new ShreeAIAgent('');
            const response = fallbackAgent.getFallbackResponse(message);
            removeTypingIndicator(typingIndicator);
            addChatMessage(response, 'bot');
        } else {
            // Use real AI agent
            const response = await aiAgent.sendMessage(message);
            removeTypingIndicator(typingIndicator);
            addChatMessage(response.message, 'bot');
        }
    } catch (error) {
        console.error('Chat error:', error);
        removeTypingIndicator(typingIndicator);
        addChatMessage("Sorry, I'm having trouble connecting. Please try again!", 'bot');
    }
    
    isTyping = false;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message fade-in`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <i class="fas fa-robot"></i>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <i class="fas fa-robot"></i>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.remove();
    }
}

function handleAIChatKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendAIChatMessage();
    }
}

// ===============================================
// API KEY CONFIGURATION
// ===============================================

// Check for API key in localStorage or prompt user
function setupAIAgent() {
    const storedApiKey = localStorage.getItem('groq_api_key');
    
    if (storedApiKey) {
        initializeAIAgent(storedApiKey);
    } else {
        console.log('💡 Set Groq API key: Visit /settings.html or use localStorage.setItem("groq_api_key", "YOUR_KEY")');
        // Initialize with empty key to use fallback responses
        initializeAIAgent('');
    }
}

// Auto-initialize when script loads
if (document.getElementById('chatMessages')) {
    setupAIAgent();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShreeAIAgent, initializeAIAgent };
}

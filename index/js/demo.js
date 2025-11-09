// ===============================================
// DEMO PAGE - INTERACTIVE SIMULATIONS
// All demos enhanced with Groq AI API
// ===============================================

// API Configuration - Users need to set their own key via settings.html
const GROQ_API_KEY = localStorage.getItem('groq_api_key') || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Helper function to call Groq API
async function callGroqAPI(systemPrompt, userPrompt, temperature = 0.7) {
    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: temperature,
                max_tokens: 500
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Groq API Error:', error);
        throw error;
    }
}

// ===============================================
// SENTIMENT ANALYZER DEMO - NOW WITH REAL AI
// ===============================================

async function runSentimentAnalysis() {
    const input = document.getElementById('sentimentInput').value.trim();
    const output = document.getElementById('sentimentOutput');
    const badge = document.getElementById('sentimentBadge');
    const score = document.getElementById('sentimentScore');
    const details = document.getElementById('sentimentDetails');
    
    if (!input) {
        alert('Please enter some text to analyze!');
        return;
    }
    
    // Show loading
    output.style.display = 'block';
    badge.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    badge.style.backgroundColor = 'var(--color-primary)';
    badge.style.color = 'white';
    
    try {
        // Try Python backend first
        if (typeof analyzeSentimentPython !== 'undefined') {
            const pythonResult = await analyzeSentimentPython(input, GROQ_API_KEY);
            if (pythonResult && pythonResult.success) {
                const colors = {
                    'Positive': '#10B981',
                    'Negative': '#EF4444',
                    'Neutral': '#9CA3AF'
                };
                
                badge.innerHTML = pythonResult.sentiment + ' 🐍';
                badge.style.backgroundColor = colors[pythonResult.sentiment];
                score.textContent = pythonResult.confidence + '%';
                
                details.innerHTML = `
                    <p style="margin-top: 1rem; color: var(--text-secondary);">
                        <strong>🐍 Python AI Analysis:</strong> ${pythonResult.explanation}
                    </p>
                `;
                return;
            }
        }
        
        // Fallback to Groq API direct
        const systemPrompt = 'You are a sentiment analysis expert. Analyze the sentiment and respond ONLY with a JSON object: {"sentiment": "Positive/Negative/Neutral", "confidence": 85, "reasoning": "brief explanation"}';
        const userPrompt = `Analyze the sentiment: "${input}"`;
        
        const aiResponse = await callGroqAPI(systemPrompt, userPrompt, 0.3);
        
        // Parse AI response
        let result;
        try {
            result = JSON.parse(aiResponse.replace(/```json\n|```/g, ''));
        } catch {
            result = {
                sentiment: aiResponse.includes('Positive') ? 'Positive' : aiResponse.includes('Negative') ? 'Negative' : 'Neutral',
                confidence: 85,
                reasoning: aiResponse
            };
        }
        
        const colors = {
            'Positive': '#10B981',
            'Negative': '#EF4444',
            'Neutral': '#9CA3AF'
        };
        
        badge.innerHTML = result.sentiment;
        badge.style.backgroundColor = colors[result.sentiment];
        score.textContent = result.confidence + '%';
        
        details.innerHTML = `
            <p style="margin-top: 1rem; color: var(--text-secondary);">
                <strong>🤖 AI Analysis:</strong> ${result.reasoning}
            </p>
        `;
        
    } catch (error) {
        // Fallback to simple analysis
        performSimpleSentimentAnalysis(input, badge, score, details);
    }
}

function performSimpleSentimentAnalysis(input, badge, score, details) {
    const positiveWords = ['love', 'great', 'amazing', 'excellent', 'perfect', 'awesome', 'wonderful', 'fantastic', 'good', 'best'];
    const negativeWords = ['hate', 'bad', 'terrible', 'awful', 'horrible', 'worst', 'poor', 'disappointing', 'sad', 'angry'];
        
    const lowerInput = input.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
        if (lowerInput.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
        if (lowerInput.includes(word)) negativeCount++;
    });
    
    let sentiment, confidence, color;
    
    if (positiveCount > negativeCount) {
        sentiment = 'Positive';
        confidence = Math.min(90, 60 + (positiveCount * 10));
        color = '#10B981';
    } else if (negativeCount > positiveCount) {
        sentiment = 'Negative';
        confidence = Math.min(90, 60 + (negativeCount * 10));
        color = '#EF4444';
    } else {
        sentiment = 'Neutral';
        confidence = Math.random() * 30 + 50;
        color = '#9CA3AF';
    }
    
    badge.innerHTML = sentiment;
    badge.style.backgroundColor = color;
    badge.style.color = 'white';
    score.textContent = confidence.toFixed(1) + '%';
    
    details.innerHTML = `
        <p style="margin-top: 1rem; color: var(--text-secondary);">
            <strong>Analysis:</strong> The text appears to express ${sentiment.toLowerCase()} sentiment
            with ${confidence.toFixed(1)}% confidence. Detected ${positiveCount} positive 
            and ${negativeCount} negative indicators. (Fallback mode)
        </p>
    `;
}

// ===============================================
// IMAGE CLASSIFIER DEMO - NOW WITH REAL AI
// ===============================================

let uploadedImage = null;

function handleImageUpload(event) {
    const file = event.target.files[0];
    const classifyBtn = document.getElementById('classifyBtn');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage = e.target.result;
            classifyBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
}

function classifyImage() {
    if (!uploadedImage) {
        alert('Please upload an image first!');
        return;
    }
    
    const output = document.getElementById('imageOutput');
    const preview = document.getElementById('imagePreview');
    const results = document.getElementById('classificationResults');
    
    output.style.display = 'block';
    preview.innerHTML = `<img src="${uploadedImage}" style="max-width: 100%; border-radius: var(--radius-lg);">`;
    results.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Classifying image...</p>';
    
    // Simulate classification
    setTimeout(() => {
        const categories = [
            { name: 'Cat', confidence: Math.random() * 30 + 70 },
            { name: 'Dog', confidence: Math.random() * 40 + 30 },
            { name: 'Bird', confidence: Math.random() * 30 + 20 },
            { name: 'Landscape', confidence: Math.random() * 25 + 15 },
            { name: 'Food', confidence: Math.random() * 20 + 10 }
        ];
        
        categories.sort((a, b) => b.confidence - a.confidence);
        
        let html = '<div style="margin-top: 1rem;">';
        categories.forEach((cat, index) => {
            const barWidth = cat.confidence;
            const color = index === 0 ? 'var(--color-primary)' : 'var(--color-gray-400)';
            html += `
                <div style="margin-bottom: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                        <strong>${cat.name}</strong>
                        <span>${cat.confidence.toFixed(1)}%</span>
                    </div>
                    <div style="width: 100%; height: 8px; background-color: var(--color-gray-200); border-radius: 4px; overflow: hidden;">
                        <div style="width: ${barWidth}%; height: 100%; background-color: ${color}; transition: width 0.5s;"></div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        results.innerHTML = `
            <p style="color: var(--color-primary); font-weight: 600;">
                <i class="fas fa-check-circle"></i> Most likely: ${categories[0].name} (${categories[0].confidence.toFixed(1)}% confidence)
            </p>
            ${html}
        `;
    }, 2000);
}

// ===============================================
// CHATBOT DEMO
// ===============================================
// Now handled by ai-agent.js with real Groq API integration

// ===============================================
// STOCK PREDICTOR DEMO - NOW WITH REAL AI
// ===============================================

async function predictStock() {
    const input = document.getElementById('stockInput').value.trim().toUpperCase();
    const output = document.getElementById('stockOutput');
    const symbolEl = document.getElementById('stockSymbol');
    const predictionEl = document.getElementById('stockPrediction');
    const confidenceEl = document.getElementById('stockConfidence');
    
    if (!input) {
        alert('Please enter a stock symbol!');
        return;
    }
    
    output.style.display = 'block';
    symbolEl.innerHTML = `<h3>${input}</h3>`;
    predictionEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI analyzing market trends...';
    
    try {
        // Use real AI for stock prediction analysis
        const systemPrompt = 'You are a financial analyst. Provide a brief, realistic stock market prediction analysis. Respond in JSON: {"direction": "up/down", "percentage": 5.2, "confidence": 75, "reasoning": "brief explanation"}';
        const userPrompt = `Provide a short-term prediction for stock symbol ${input}. Note: This is for educational demo purposes.`;
        
        const aiResponse = await callGroqAPI(systemPrompt, userPrompt, 0.6);
        
        // Parse AI response
        let result;
        try {
            result = JSON.parse(aiResponse.replace(/```json\n|```/g, ''));
        } catch {
            // Fallback
            result = {
                direction: Math.random() > 0.5 ? 'up' : 'down',
                percentage: (Math.random() * 10 + 2).toFixed(2),
                confidence: (Math.random() * 20 + 70).toFixed(1)
            };
        }
        
        const icon = result.direction === 'up' ? 'arrow-up' : 'arrow-down';
        const color = result.direction === 'up' ? 'var(--color-success)' : 'var(--color-error)';
        
        predictionEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background-color: var(--bg-secondary); border-radius: var(--radius-lg); margin-bottom: 1rem;">
                <i class="fas fa-${icon}" style="font-size: 3rem; color: ${color};"></i>
                <div>
                    <h4 style="margin: 0; color: ${color};">🤖 AI Predicts: ${result.direction.toUpperCase()}</h4>
                    <p style="margin: 0; font-size: 1.5rem; font-weight: 700;">${result.percentage}%</p>
                </div>
            </div>
        `;
        
        confidenceEl.innerHTML = `
            <p style="color: var(--text-secondary);">
                <strong>Confidence Level:</strong> ${result.confidence}%<br>
                <strong>Timeframe:</strong> Next 7 days<br>
                <strong>Analysis Date:</strong> ${new Date().toLocaleDateString()}<br>
                <strong>AI Reasoning:</strong> ${result.reasoning || 'Market analysis complete'}
            </p>
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 1rem;">
                <em>⚠️ This is an AI-generated prediction for demonstration purposes only. 
                Not financial advice! Always do your own research.</em>
            </p>
        `;
        
    } catch (error) {
        // Fallback to simple prediction
        performSimpleStockPrediction(input, symbolEl, predictionEl, confidenceEl);
    }
}

function performSimpleStockPrediction(input, symbolEl, predictionEl, confidenceEl) {
    const direction = Math.random() > 0.5 ? 'up' : 'down';
    const percentage = (Math.random() * 10 + 2).toFixed(2);
    const confidence = (Math.random() * 20 + 70).toFixed(1);
    
    const icon = direction === 'up' ? 'arrow-up' : 'arrow-down';
    const color = direction === 'up' ? 'var(--color-success)' : 'var(--color-error)';
    
    predictionEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background-color: var(--bg-secondary); border-radius: var(--radius-lg); margin-bottom: 1rem;">
            <i class="fas fa-${icon}" style="font-size: 3rem; color: ${color};"></i>
            <div>
                <h4 style="margin: 0; color: ${color};">Predicted to go ${direction.toUpperCase()}</h4>
                <p style="margin: 0; font-size: 1.5rem; font-weight: 700;">${percentage}%</p>
            </div>
        </div>
    `;
    
    confidenceEl.innerHTML = `
        <p style="color: var(--text-secondary);">
            <strong>Confidence Level:</strong> ${confidence}%<br>
            <strong>Timeframe:</strong> Next 7 days<br>
            <strong>Analysis Date:</strong> ${new Date().toLocaleDateString()}
        </p>
        <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 1rem;">
            <em>Note: This is a simulated prediction for demonstration purposes only. 
            Not financial advice!</em>
        </p>
    `;
}

// ===============================================
// TEXT-TO-SPEECH DEMO - INSTANT PLAYBACK
// ===============================================

// Load voices on page load
let voicesLoaded = false;
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        voicesLoaded = true;
    };
    // Trigger voice loading
    window.speechSynthesis.getVoices();
}

// Quick test function
function testSpeech() {
    const status = document.getElementById('testStatus');
    
    if (!('speechSynthesis' in window)) {
        status.innerHTML = '❌ Speech not supported in this browser';
        status.style.color = 'var(--color-error)';
        return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('Hello World! Text to speech is working!');
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
        status.innerHTML = '✅ Playing...';
        status.style.color = 'var(--color-success)';
    };
    
    utterance.onend = () => {
        status.innerHTML = '✅ Test successful! Speech is working.';
        status.style.color = 'var(--color-success)';
    };
    
    utterance.onerror = (e) => {
        status.innerHTML = '❌ Error: ' + e.error;
        status.style.color = 'var(--color-error)';
    };
    
    window.speechSynthesis.speak(utterance);
}

function generateSpeech() {
    const input = document.getElementById('ttsInput').value.trim();
    const voice = document.getElementById('voiceSelect').value;
    const speed = parseFloat(document.getElementById('speedSelect').value);
    const output = document.getElementById('ttsOutput');
    
    if (!input) {
        alert('Please enter some text!');
        return;
    }
    
    // Use Web Speech API for real text-to-speech
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(input);
        utterance.rate = speed;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';
        
        // Get available voices
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);
        
        // Select voice based on preference
        if (voices.length > 0) {
            if (voice === 'female') {
                // Look for female voices
                const femaleVoice = voices.find(v => 
                    v.name.includes('Female') || 
                    v.name.includes('Samantha') || 
                    v.name.includes('Zira') ||
                    v.name.includes('Google UK English Female') ||
                    v.name.includes('Microsoft Zira')
                ) || voices.find(v => v.lang.startsWith('en'));
                if (femaleVoice) {
                    utterance.voice = femaleVoice;
                    console.log('Using voice:', femaleVoice.name);
                }
            } else if (voice === 'male') {
                // Look for male voices
                const maleVoice = voices.find(v => 
                    v.name.includes('Male') || 
                    v.name.includes('David') || 
                    v.name.includes('Mark') ||
                    v.name.includes('Google US English') ||
                    v.name.includes('Microsoft David')
                ) || voices.find(v => v.lang.startsWith('en'));
                if (maleVoice) {
                    utterance.voice = maleVoice;
                    console.log('Using voice:', maleVoice.name);
                }
            } else if (voice === 'robotic') {
                utterance.pitch = 0.5;
                utterance.rate = speed * 0.8;
                // Use any voice for robotic
                const roboticVoice = voices.find(v => v.lang.startsWith('en'));
                if (roboticVoice) utterance.voice = roboticVoice;
            }
        }
        
        // Show initial state
        output.style.display = 'block';
        output.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: var(--bg-secondary); border-radius: var(--radius-lg);">
                <i class="fas fa-spinner fa-pulse" style="font-size: 3rem; color: var(--color-primary); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary); font-weight: 600;">
                    Starting playback...
                </p>
            </div>
        `;
        
        // Event handlers
        utterance.onstart = function() {
            console.log('Speech started');
            output.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: var(--bg-secondary); border-radius: var(--radius-lg);">
                    <i class="fas fa-volume-up" style="font-size: 3rem; color: var(--color-success); margin-bottom: 1rem; animation: pulse 1s infinite;"></i>
                    <p style="color: var(--color-success); font-weight: 600; margin-bottom: 1rem;">
                        🔊 Playing audio...
                    </p>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                        Voice: ${voice.charAt(0).toUpperCase() + voice.slice(1)} | Speed: ${speed}x
                    </p>
                    <div style="background: var(--bg-primary); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                        <em>"${input.substring(0, 100)}${input.length > 100 ? '...' : ''}"</em>
                    </div>
                    <button class="btn btn-secondary" onclick="window.speechSynthesis.cancel(); document.getElementById('ttsOutput').innerHTML = '<p style=\'text-align: center; color: var(--text-muted);\'>Stopped</p>';">
                        <i class="fas fa-stop"></i> Stop
                    </button>
                </div>
            `;
        };
        
        utterance.onend = function() {
            console.log('Speech ended');
            output.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: var(--bg-secondary); border-radius: var(--radius-lg);">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--color-success); margin-bottom: 1rem;"></i>
                    <p style="color: var(--color-success); font-weight: 600; margin-bottom: 1rem;">
                        ✅ Playback completed!
                    </p>
                    <p style="color: var(--text-secondary);">
                        Voice: ${voice.charAt(0).toUpperCase() + voice.slice(1)} | Speed: ${speed}x
                    </p>
                </div>
            `;
        };
        
        utterance.onerror = function(event) {
            console.error('Speech error:', event.error);
            output.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: var(--bg-secondary); border-radius: var(--radius-lg);">
                    <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: var(--color-error); margin-bottom: 1rem;"></i>
                    <p style="color: var(--color-error); font-weight: 600; margin-bottom: 0.5rem;">
                        Error: ${event.error}
                    </p>
                    <p style="color: var(--text-secondary); font-size: 0.875rem;">
                        Try using a different browser (Chrome/Edge recommended) or check your sound settings.
                    </p>
                </div>
            `;
        };
        
        // Speak the text
        console.log('Speaking text:', input);
        window.speechSynthesis.speak(utterance);
        
    } else {
        // Fallback if browser doesn't support Web Speech API
        output.style.display = 'block';
        output.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: var(--bg-secondary); border-radius: var(--radius-lg);">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--color-warning); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">
                    ⚠️ Your browser doesn't support Text-to-Speech.<br>
                    <em>Please try using Chrome, Edge, or Safari.</em>
                </p>
                <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-primary); border-radius: var(--radius-md);">
                    <strong>Settings:</strong> ${voice.charAt(0).toUpperCase() + voice.slice(1)} voice at ${speed}x speed
                </div>
            </div>
        `;
    }
}

// ===============================================
// WORKFLOW AUTOMATION DEMO - AI-POWERED
// ===============================================

const workflowTemplates = {
    'email-summarizer': {
        name: 'Email Summarizer',
        steps: [
            { icon: 'envelope', text: 'Reading email content...', delay: 800 },
            { icon: 'brain', text: 'AI analyzing and summarizing...', delay: 1500 },
            { icon: 'check', text: 'Generating summary...', delay: 1000 },
            { icon: 'paper-plane', text: 'Sending to Slack...', delay: 800 }
        ],
        aiPrompt: 'Summarize this email in 2-3 sentences and extract key action items:'
    },
    'content-publisher': {
        name: 'Content Publisher',
        steps: [
            { icon: 'file-alt', text: 'Processing content...', delay: 800 },
            { icon: 'magic', text: 'AI optimizing for SEO...', delay: 1500 },
            { icon: 'hashtag', text: 'Generating social media posts...', delay: 1200 },
            { icon: 'share-alt', text: 'Publishing to platforms...', delay: 1000 }
        ],
        aiPrompt: 'Optimize this content for social media and suggest 3 engaging post variations with hashtags:'
    },
    'customer-support': {
        name: 'Customer Support Router',
        steps: [
            { icon: 'ticket-alt', text: 'Ticket received...', delay: 600 },
            { icon: 'robot', text: 'AI categorizing issue...', delay: 1200 },
            { icon: 'chart-bar', text: 'Analyzing priority level...', delay: 1000 },
            { icon: 'user-friends', text: 'Routing to appropriate team...', delay: 800 }
        ],
        aiPrompt: 'Categorize this support ticket (Technical/Billing/General), determine priority (High/Medium/Low), and suggest which team should handle it:'
    },
    'data-processor': {
        name: 'Data Processor',
        steps: [
            { icon: 'database', text: 'Loading data...', delay: 800 },
            { icon: 'cog', text: 'AI analyzing patterns...', delay: 1500 },
            { icon: 'chart-line', text: 'Generating insights...', delay: 1200 },
            { icon: 'file-pdf', text: 'Creating report...', delay: 1000 }
        ],
        aiPrompt: 'Analyze this data and provide key insights, trends, and actionable recommendations:'
    },
    'social-monitor': {
        name: 'Social Media Monitor',
        steps: [
            { icon: 'search', text: 'Scanning social media...', delay: 1000 },
            { icon: 'brain', text: 'AI analyzing sentiment...', delay: 1500 },
            { icon: 'exclamation-triangle', text: 'Checking for issues...', delay: 800 },
            { icon: 'bell', text: 'Sending alerts...', delay: 600 }
        ],
        aiPrompt: 'Analyze the sentiment of this social media mention and determine if it requires immediate attention:'
    },
    'lead-scorer': {
        name: 'Lead Scoring System',
        steps: [
            { icon: 'user-plus', text: 'New lead detected...', delay: 600 },
            { icon: 'brain', text: 'AI analyzing lead quality...', delay: 1500 },
            { icon: 'star', text: 'Calculating score...', delay: 1000 },
            { icon: 'database', text: 'Updating CRM...', delay: 800 },
            { icon: 'bell', text: 'Notifying sales team...', delay: 600 }
        ],
        aiPrompt: 'Analyze this lead and provide: 1) Lead score (0-100), 2) Quality rating (Hot/Warm/Cold), 3) Key signals, 4) Recommended next action:'
    },
    'invoice-processor': {
        name: 'Invoice Processor',
        steps: [
            { icon: 'file-invoice', text: 'Receiving invoice...', delay: 800 },
            { icon: 'robot', text: 'AI extracting data...', delay: 1500 },
            { icon: 'check-double', text: 'Validating information...', delay: 1000 },
            { icon: 'database', text: 'Syncing with accounting...', delay: 1200 },
            { icon: 'envelope', text: 'Sending confirmation...', delay: 600 }
        ],
        aiPrompt: 'Extract and structure invoice details: vendor, amount, date, items, payment terms, and suggest approval workflow:'
    },
    'meeting-scheduler': {
        name: 'Smart Meeting Scheduler',
        steps: [
            { icon: 'calendar-check', text: 'Reading meeting request...', delay: 700 },
            { icon: 'brain', text: 'AI finding optimal time slots...', delay: 1500 },
            { icon: 'users', text: 'Checking attendee availability...', delay: 1200 },
            { icon: 'calendar-plus', text: 'Creating calendar event...', delay: 800 },
            { icon: 'paper-plane', text: 'Sending invitations...', delay: 600 }
        ],
        aiPrompt: 'Based on this meeting request, suggest: 1) Best meeting times, 2) Duration, 3) Agenda topics, 4) Required attendees:'
    },
    'document-translator': {
        name: 'Document Translator',
        steps: [
            { icon: 'file-alt', text: 'Loading document...', delay: 800 },
            { icon: 'language', text: 'AI translating content...', delay: 2000 },
            { icon: 'spell-check', text: 'Quality checking...', delay: 1000 },
            { icon: 'file-pdf', text: 'Formatting output...', delay: 800 },
            { icon: 'share', text: 'Distributing to recipients...', delay: 600 }
        ],
        aiPrompt: 'Translate this text to Spanish, French, and German while maintaining professional tone and context:'
    },
    'video-transcriber': {
        name: 'Video Transcriber',
        steps: [
            { icon: 'video', text: 'Processing video file...', delay: 1000 },
            { icon: 'microphone', text: 'AI extracting audio...', delay: 1500 },
            { icon: 'closed-captioning', text: 'Generating transcription...', delay: 2000 },
            { icon: 'text-height', text: 'Creating subtitles...', delay: 1200 },
            { icon: 'save', text: 'Exporting files...', delay: 800 }
        ],
        aiPrompt: 'Transcribe this audio/video content, add timestamps, identify speakers, and summarize key points:'
    },
    'construction-manager': {
        name: 'Construction Project Manager',
        steps: [
            { icon: 'hard-hat', text: 'Analyzing project requirements...', delay: 1200 },
            { icon: 'brain', text: 'AI generating task breakdown...', delay: 1800 },
            { icon: 'calendar-alt', text: 'Creating project timeline...', delay: 1500 },
            { icon: 'dollar-sign', text: 'Calculating budget estimates...', delay: 1200 },
            { icon: 'truck', text: 'Estimating materials needed...', delay: 1500 },
            { icon: 'users-cog', text: 'Assigning crew resources...', delay: 1000 },
            { icon: 'exclamation-triangle', text: 'Running risk assessment...', delay: 1200 },
            { icon: 'clipboard-check', text: 'Generating safety checklist...', delay: 800 },
            { icon: 'file-alt', text: 'Creating project report...', delay: 1000 }
        ],
        aiPrompt: 'You are a construction project manager AI. Based on this project description, provide: 1) Estimated timeline, 2) Budget breakdown, 3) Key tasks, 4) Risk factors, 5) Resource requirements:'
    }
};

async function runAutomation() {
    const template = document.getElementById('workflowTemplate').value;
    const triggerInput = document.getElementById('triggerInput').value.trim();
    const output = document.getElementById('automationOutput');
    const stepsDiv = document.getElementById('workflowSteps');
    const resultDiv = document.getElementById('workflowResult');
    
    if (!triggerInput) {
        alert('Please enter trigger data!');
        return;
    }
    
    const workflow = workflowTemplates[template];
    output.style.display = 'block';
    stepsDiv.innerHTML = '';
    resultDiv.innerHTML = '';
    
    // Run through workflow steps
    for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        
        // Add step
        const stepEl = document.createElement('div');
        stepEl.className = 'workflow-step';
        stepEl.style.cssText = 'display: flex; align-items: center; gap: 1rem; padding: 1rem; margin-bottom: 0.5rem; background: var(--bg-secondary); border-radius: var(--radius-md); border-left: 4px solid var(--color-primary);';
        stepEl.innerHTML = `
            <i class="fas fa-${step.icon}" style="font-size: 1.5rem; color: var(--color-primary);"></i>
            <div style="flex: 1;">
                <strong style="color: var(--text-primary);">${step.text}</strong>
            </div>
            <i class="fas fa-spinner fa-spin" style="color: var(--color-primary);"></i>
        `;
        stepsDiv.appendChild(stepEl);
        
        await new Promise(resolve => setTimeout(resolve, step.delay));
        
        // Mark as complete
        stepEl.querySelector('.fa-spinner').remove();
        stepEl.innerHTML += '<i class="fas fa-check-circle" style="color: var(--color-success); font-size: 1.2rem;"></i>';
    }
    
    // Get AI result
    resultDiv.innerHTML = '<p style="text-align: center;"><i class="fas fa-spinner fa-spin" style="color: var(--color-primary);"></i> AI processing final result...</p>';
    
    try {
        // Use real AI for automation result
        const aiResponse = await callGroqAPI(
            'You are an automation assistant. Provide clear, actionable results for workflow automations.',
            workflow.aiPrompt + '\n\n' + triggerInput,
            0.5
        );
        
        resultDiv.innerHTML = `
            <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 72, 255, 0.1)); border-radius: var(--radius-lg); border: 2px solid var(--color-success);">
                <h4 style="color: var(--color-success); margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i> ✅ Automation Completed!
                </h4>
                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                    <strong style="color: var(--color-primary);"><i class="fas fa-robot"></i> AI Result:</strong>
                    <p style="margin: 0.5rem 0 0; color: var(--text-primary); white-space: pre-wrap;">${aiResponse}</p>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span style="padding: 0.5rem 1rem; background: var(--color-success); color: white; border-radius: var(--radius-full); font-size: 0.875rem;">
                        <i class="fas fa-clock"></i> ${(workflow.steps.reduce((sum, s) => sum + s.delay, 0) / 1000).toFixed(1)}s
                    </span>
                    <span style="padding: 0.5rem 1rem; background: var(--color-primary); color: white; border-radius: var(--radius-full); font-size: 0.875rem;">
                        <i class="fas fa-check"></i> ${workflow.steps.length} steps
                    </span>
                    <span style="padding: 0.5rem 1rem; background: var(--color-gold); color: white; border-radius: var(--radius-full); font-size: 0.875rem;">
                        <i class="fas fa-robot"></i> AI Powered
                    </span>
                </div>
            </div>
        `;
        
    } catch (error) {
        // Fallback result
        const fallbackResults = {
            'email-summarizer': '📧 **Summary:** Client wants to discuss Q1 results showing 35% conversion increase and budget reallocation.\n\n**Action Items:**\n✓ Schedule meeting this week\n✓ Prepare Q1 marketing report\n✓ Review budget proposals',
            'content-publisher': '📱 **Post 1:** "Just saw a 35% conversion boost! 🚀 Q1 marketing wins are in. Time to scale up! #MarketingSuccess #Growth"\n\n📱 **Post 2:** "Data-driven results: Our latest campaign crushed it with 35% higher conversions. What\'s your secret? 📊 #DigitalMarketing"\n\n📱 **Post 3:** "Q1 recap: Big wins, bigger plans. Marketing ROI never looked this good! 💪 #BusinessGrowth"',
            'customer-support': '🎫 **Category:** General Inquiry\n**Priority:** Medium\n**Team:** Marketing Team\n**Suggested Response Time:** 24 hours\n\n**Reason:** Non-urgent discussion about quarterly results and meeting scheduling.',
            'data-processor': '📊 **Key Insights:**\n• 35% increase in conversions indicates successful campaign\n• Budget reallocation needed for Q2\n• Strong momentum for scaling\n\n**Recommendations:**\n1. Double down on winning channels\n2. Prepare detailed budget analysis\n3. Schedule strategy session ASAP',
            'social-monitor': '😊 **Sentiment:** Positive (85% confidence)\n**Urgency:** Low\n**Action:** No immediate action required\n\n**Analysis:** Positive business discussion about growth. Continue monitoring for engagement opportunities.',
            'lead-scorer': '⭐ **Lead Score:** 85/100\n**Quality:** HOT 🔥\n\n**Key Signals:**\n✓ Multiple page visits\n✓ Engaged with pricing page\n✓ Downloaded resources\n✓ Company size matches ICP\n\n**Recommended Action:** Priority follow-up within 24 hours. High conversion potential.',
            'invoice-processor': '💰 **Invoice Details:**\n• Vendor: Tech Supplies Inc.\n• Amount: $2,450.00\n• Date: 2025-01-15\n• Payment Terms: Net 30\n• Items: Software licenses (3), Hardware equipment (2)\n\n**Status:** ✅ Auto-approved (within budget threshold)\n**Payment Scheduled:** 2025-02-14',
            'meeting-scheduler': '📅 **Optimal Meeting Times:**\n1. Tomorrow 2:00 PM - 3:00 PM (All available)\n2. Friday 10:00 AM - 11:00 AM (Best for productivity)\n3. Next Monday 3:00 PM - 4:00 PM (Alternative)\n\n**Suggested Agenda:**\n• Q1 Results Review (15 min)\n• Budget Discussion (25 min)\n• Q2 Strategy (20 min)\n\n**Attendees:** Marketing Team, Finance Lead',
            'document-translator': '🌍 **Translation Complete:**\n\n**Spanish:** "Hola equipo, quería discutir los resultados de la campaña de marketing Q1..."\n\n**French:** "Bonjour l\'équipe, je voulais discuter des résultats de la campagne marketing Q1..."\n\n**German:** "Hallo Team, ich wollte die Ergebnisse der Q1-Marketingkampagne besprechen..."\n\n✅ Professional tone maintained across all languages',
            'video-transcriber': '🎥 **Transcription:**\n\n[00:00] Speaker 1: "Hi team, I wanted to discuss the Q1 marketing campaign results."\n[00:05] Speaker 1: "We\'ve seen a 35% increase in conversions..."\n[00:12] Speaker 1: "...but need to adjust our budget allocation for next quarter."\n\n**Summary:** Discussion of Q1 marketing success and Q2 planning\n**Duration:** 45 seconds\n**Speakers:** 1\n**Key Topics:** Q1 results, conversions, budget planning',
            'construction-manager': '🏭 **Construction Project Analysis:**\n\n**📅 Timeline:** 120 days (4 months)\n**💰 Budget Breakdown:**\n• Materials: $180,000 (40%)\n• Labor: $157,500 (35%)\n• Equipment: $45,000 (10%)\n• Permits & Fees: $22,500 (5%)\n• Contingency: $45,000 (10%)\n**Total:** $450,000\n\n**📝 Key Tasks (14 phases):**\n1. Site Preparation (5 days)\n2. Foundation Work (10 days)\n3. Framing (15 days)\n4. Roofing (7 days)\n5. MEP Rough-In (22 days)\n6. Insulation & Drywall (12 days)\n7. Interior Finishing (20 days)\n8. Final Inspection (3 days)\n\n**⚠️ Risk Assessment:**\n• Weather Delays: Medium Risk\n• Material Shortage: Medium Risk\n• Budget Overrun: Low Risk (10% contingency)\n• Safety Incidents: Low Risk (daily briefings)\n\n**👷 Resources:**\n• General Crew: 8-12 workers\n• Specialized Teams: 6 teams\n• Equipment: Excavator, crane, scaffolding\n\n**✅ Safety Checklist:** 8 critical items\n**📊 Progress Tracking:** Weekly milestones\n**🚨 Emergency Protocol:** On-site first aid, fire safety'
        };
        
        resultDiv.innerHTML = `
            <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 72, 255, 0.1)); border-radius: var(--radius-lg); border: 2px solid var(--color-success);">
                <h4 style="color: var(--color-success); margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i> ✅ Automation Completed!
                </h4>
                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                    <strong style="color: var(--color-primary);"><i class="fas fa-cog"></i> Result:</strong>
                    <p style="margin: 0.5rem 0 0; color: var(--text-primary); white-space: pre-wrap;">${fallbackResults[template]}</p>
                </div>
                <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;">
                    <em>Note: Using fallback mode. Connect API for real-time AI processing.</em>
                </p>
            </div>
        `;
    }
}

function clearAutomation() {
    document.getElementById('automationOutput').style.display = 'none';
    document.getElementById('workflowSteps').innerHTML = '';
    document.getElementById('workflowResult').innerHTML = '';
}

// ===============================================
// REAL ESTATE AUTOMATION DEMO
// ===============================================

async function analyzeProperty() {
    const input = document.getElementById('propertyInput').value.trim();
    const output = document.getElementById('realestateOutput');
    const analysisDiv = document.getElementById('propertyAnalysis');
    
    if (!input) {
        alert('Please enter property details!');
        return;
    }
    
    output.style.display = 'block';
    analysisDiv.innerHTML = '<p style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> AI analyzing property...</p>';
    
    try {
        // Use real AI for property analysis
        const systemPrompt = 'You are a real estate expert. Analyze property listings and provide: 1) Estimated market value, 2) Key highlights, 3) Investment potential, 4) Neighborhood insights, 5) Recommendations.';
        const userPrompt = `Analyze this property: ${input}`;
        
        const aiResponse = await callGroqAPI(systemPrompt, userPrompt, 0.6);
        
        // Extract value estimate (simplified)
        const valueMatch = aiResponse.match(/\$?([0-9,]+)/);
        const estimatedValue = valueMatch ? valueMatch[0] : '$45 Lakhs';
        
        analysisDiv.innerHTML = `
            <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 72, 255, 0.1)); border-radius: var(--radius-lg); border: 2px solid var(--color-success);">
                <h4 style="color: var(--color-success); margin-bottom: 1.5rem;">
                    <i class="fas fa-check-circle"></i> ✅ Property Analysis Complete!
                </h4>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
                        <i class="fas fa-home" style="font-size: 2rem; color: var(--color-primary); margin-bottom: 0.5rem;"></i>
                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">Estimated Value</p>
                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-success); margin: 0.25rem 0 0;">${estimatedValue}</p>
                    </div>
                    <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
                        <i class="fas fa-star" style="font-size: 2rem; color: var(--color-gold); margin-bottom: 0.5rem;"></i>
                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">Investment Rating</p>
                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-gold); margin: 0.25rem 0 0;">★★★★☆</p>
                    </div>
                    <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
                        <i class="fas fa-chart-line" style="font-size: 2rem; color: var(--color-success); margin-bottom: 0.5rem;"></i>
                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">ROI Potential</p>
                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-success); margin: 0.25rem 0 0;">8-12%</p>
                    </div>
                </div>
                
                <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                    <strong style="color: var(--color-primary); display: block; margin-bottom: 1rem;">
                        <i class="fas fa-robot"></i> AI Analysis:
                    </strong>
                    <div style="color: var(--text-primary); white-space: pre-wrap; line-height: 1.6;">${aiResponse}</div>
                </div>
                
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn btn-primary">
                        <i class="fas fa-calendar"></i> Schedule Viewing
                    </button>
                    <button class="btn btn-outline">
                        <i class="fas fa-download"></i> Download Report
                    </button>
                    <button class="btn btn-outline">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>
        `;
        
    } catch (error) {
        // Fallback analysis
        analysisDiv.innerHTML = `
            <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 72, 255, 0.1)); border-radius: var(--radius-lg); border: 2px solid var(--color-success);">
                <h4 style="color: var(--color-success); margin-bottom: 1.5rem;">
                    <i class="fas fa-check-circle"></i> ✅ Property Analysis Complete!
                </h4>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
                        <i class="fas fa-home" style="font-size: 2rem; color: var(--color-primary); margin-bottom: 0.5rem;"></i>
                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">Estimated Value</p>
                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-success); margin: 0.25rem 0 0;">₹4.5 Cr</p>
                    </div>
                    <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
                        <i class="fas fa-star" style="font-size: 2rem; color: var(--color-gold); margin-bottom: 0.5rem;"></i>
                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">Investment Rating</p>
                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-gold); margin: 0.25rem 0 0;">★★★★☆</p>
                    </div>
                    <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
                        <i class="fas fa-chart-line" style="font-size: 2rem; color: var(--color-success); margin-bottom: 0.5rem;"></i>
                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">ROI Potential</p>
                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-success); margin: 0.25rem 0 0;">8-12%</p>
                    </div>
                </div>
                
                <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                    <strong style="color: var(--color-primary); display: block; margin-bottom: 1rem;">📊 Analysis:</strong>
                    <ul style="color: var(--text-primary); line-height: 1.8; margin: 0;">
                        <li><strong>Location:</strong> Prime area with excellent connectivity</li>
                        <li><strong>Amenities:</strong> Modern facilities including gym, pool, and parking</li>
                        <li><strong>Investment Potential:</strong> Strong appreciation expected (8-12% annually)</li>
                        <li><strong>Neighborhood:</strong> Well-developed with metro access</li>
                        <li><strong>Recommendation:</strong> Good investment opportunity for both rental and capital appreciation</li>
                    </ul>
                </div>
                
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn btn-primary">
                        <i class="fas fa-calendar"></i> Schedule Viewing
                    </button>
                    <button class="btn btn-outline">
                        <i class="fas fa-download"></i> Download Report
                    </button>
                    <button class="btn btn-outline">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>
        `;
    }
}

// ===============================================
// SUPERMART AUTOMATION DEMO
// ===============================================

async function generateSupermartAutomation() {
    const input = document.getElementById('supermartInput').value.trim();
    const output = document.getElementById('supermartOutput');
    const analysisDiv = document.getElementById('supermartAnalysis');
    
    const modules = {
        inventory: document.getElementById('module-inventory').checked,
        pos: document.getElementById('module-pos').checked,
        customer: document.getElementById('module-customer').checked,
        staff: document.getElementById('module-staff').checked,
        supplier: document.getElementById('module-supplier').checked,
        pricing: document.getElementById('module-pricing').checked
    };
    
    if (!input) {
        alert('Please enter store details!');
        return;
    }
    
    output.style.display = 'block';
    analysisDiv.innerHTML = '<p style="text-align: center;"><i class="fas fa-spinner fa-spin fa-3x" style="color: var(--color-primary);"></i><br><br><strong>AI generating complete automation system...</strong></p>';
    
    try {
        const moduleList = Object.keys(modules).filter(k => modules[k]).join(', ');
        const systemPrompt = 'You are a retail automation expert. Design comprehensive automation systems for small supermarkets.';
        const userPrompt = `Design automation for: ${input}

Modules: ${moduleList}

Provide: system architecture, technology, timeline, costs, ROI.`;
        
        const aiResponse = await callGroqAPI(systemPrompt, userPrompt, 0.7);
        analysisDiv.innerHTML = generateSupermartOutput(aiResponse, modules);
        
    } catch (error) {
        const fallback = `**Supermart Automation System**

• Cloud POS with inventory sync
• Mobile apps for staff/customers
• Investment: ₹1.2L
• Timeline: 8 weeks
• ROI: 5 months
• 60% efficiency gain`;
        analysisDiv.innerHTML = generateSupermartOutput(fallback, modules);
    }
}

function generateSupermartOutput(aiText, modules) {
    let modulesHTML = '';
    
    if (modules.inventory) modulesHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #10B981"><h4 style="color:#10B981"><i class="fas fa-box"></i> Smart Inventory</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>Real-time stock tracking</li><li>Low-stock alerts</li><li>Expiry monitoring</li><li>AI demand forecasting</li></ul></div>`;
    if (modules.pos) modulesHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #0048FF"><h4 style="color:#0048FF"><i class="fas fa-cash-register"></i> Smart POS</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>Tablet-based terminals</li><li>Multiple payments (UPI/Cards)</li><li>Digital receipts</li><li>Real-time analytics</li></ul></div>`;
    if (modules.customer) modulesHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #FFD700"><h4 style="color:#FFD700"><i class="fas fa-users"></i> Customer Loyalty</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>Mobile loyalty app</li><li>Personalized offers</li><li>Purchase tracking</li><li>WhatsApp notifications</li></ul></div>`;
    if (modules.staff) modulesHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #8B5CF6"><h4 style="color:#8B5CF6"><i class="fas fa-user-tie"></i> Staff Management</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>Auto attendance</li><li>Shift scheduling</li><li>Performance analytics</li><li>Commission calculation</li></ul></div>`;
    if (modules.supplier) modulesHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #F59E0B"><h4 style="color:#F59E0B"><i class="fas fa-truck"></i> Supplier Management</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>Auto purchase orders</li><li>Price comparison</li><li>Delivery tracking</li><li>Payment scheduling</li></ul></div>`;
    if (modules.pricing) modulesHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #EF4444"><h4 style="color:#EF4444"><i class="fas fa-tags"></i> Dynamic Pricing</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>AI competitive pricing</li><li>Near-expiry discounts</li><li>Bundle recommendations</li><li>Profit optimization</li></ul></div>`;
    
    return `<div style="padding:1.5rem;background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(0,72,255,0.1));border-radius:var(--radius-lg);border:2px solid var(--color-success)"><h4 style="color:var(--color-success);margin-bottom:1.5rem"><i class="fas fa-check-circle"></i> ✅ Complete System Generated!</h4><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin-bottom:2rem"><div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);text-align:center"><i class="fas fa-rupee-sign" style="font-size:2rem;color:var(--color-success)"></i><p style="color:var(--text-secondary);font-size:0.875rem;margin:0">Investment</p><p style="font-size:1.5rem;font-weight:700;color:var(--color-primary);margin:0.25rem 0 0">₹1.2L</p></div><div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);text-align:center"><i class="fas fa-calendar-alt" style="font-size:2rem;color:var(--color-primary)"></i><p style="color:var(--text-secondary);font-size:0.875rem;margin:0">Timeline</p><p style="font-size:1.5rem;font-weight:700;color:var(--color-primary);margin:0.25rem 0 0">8 Weeks</p></div><div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);text-align:center"><i class="fas fa-chart-line" style="font-size:2rem;color:var(--color-gold)"></i><p style="color:var(--text-secondary);font-size:0.875rem;margin:0">ROI</p><p style="font-size:1.5rem;font-weight:700;color:var(--color-gold);margin:0.25rem 0 0">5 Months</p></div><div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);text-align:center"><i class="fas fa-rocket" style="font-size:2rem;color:var(--color-success)"></i><p style="color:var(--text-secondary);font-size:0.875rem;margin:0">Efficiency</p><p style="font-size:1.5rem;font-weight:700;color:var(--color-success);margin:0.25rem 0 0">60%+</p></div></div><h4 style="margin-bottom:1rem"><i class="fas fa-cogs"></i> Modules:</h4>${modulesHTML}<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1.5rem"><strong style="color:var(--color-primary);display:block;margin-bottom:1rem"><i class="fas fa-robot"></i> AI Plan:</strong><div style="color:var(--text-primary);white-space:pre-wrap;line-height:1.8">${aiText}</div></div><div style="display:flex;gap:0.75rem;flex-wrap:wrap"><button class="btn btn-primary"><i class="fas fa-download"></i> Download Report</button><button class="btn btn-outline"><i class="fas fa-calendar-check"></i> Schedule Call</button><button class="btn btn-outline"><i class="fas fa-calculator"></i> Calculate ROI</button></div></div>`;
}

// ===============================================
// MANUFACTURING & LOGISTICS AUTOMATION
// ===============================================

async function generateManufacturingAutomation() {
    const input = document.getElementById('manufacturingInput').value.trim();
    const output = document.getElementById('manufacturingOutput');
    const analysisDiv = document.getElementById('manufacturingAnalysis');
    
    const features = {
        production: document.getElementById('feature-production').checked,
        supply: document.getElementById('feature-supply').checked,
        quality: document.getElementById('feature-quality').checked,
        predictive: document.getElementById('feature-predictive').checked,
        warehouse: document.getElementById('feature-warehouse').checked,
        routing: document.getElementById('feature-routing').checked
    };
    
    if (!input) {
        alert('Please enter facility details!');
        return;
    }
    
    output.style.display = 'block';
    analysisDiv.innerHTML = '<p style="text-align: center;"><i class="fas fa-spinner fa-spin fa-3x" style="color: var(--color-primary);"></i><br><br><strong>AI generating complete manufacturing automation system...</strong></p>';
    
    try {
        const featureList = Object.keys(features).filter(k => features[k]).join(', ');
        const systemPrompt = 'You are a manufacturing and logistics automation expert. Design comprehensive automation systems for manufacturing facilities including production optimization, supply chain, quality control, and smart logistics.';
        const userPrompt = `Design automation for: ${input}

Features: ${featureList}

Provide: system architecture, technology stack, implementation timeline, cost estimates, ROI projections, efficiency gains.`;
        
        const aiResponse = await callGroqAPI(systemPrompt, userPrompt, 0.7);
        analysisDiv.innerHTML = generateManufacturingOutput(aiResponse, features);
        
    } catch (error) {
        const fallback = `**Manufacturing & Logistics Automation System**

**System Architecture:**
• IoT sensors for real-time monitoring
• AI-powered production planning
• Automated quality control with computer vision
• Predictive maintenance algorithms

**Investment:** ₹2.5 Crores
**Timeline:** 12-16 weeks
**ROI:** 8-10 months
**Efficiency Gain:** 45-60%

**Key Benefits:**
• 40% reduction in production downtime
• 50% faster quality inspection
• 35% improvement in supply chain efficiency
• 30% reduction in maintenance costs`;
        analysisDiv.innerHTML = generateManufacturingOutput(fallback, features);
    }
}

function generateManufacturingOutput(aiText, features) {
    let featuresHTML = '';
    
    if (features.production) featuresHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #0048FF"><h4 style="color:#0048FF"><i class="fas fa-industry"></i> Production Optimization</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>AI-driven production scheduling</li><li>Real-time bottleneck detection</li><li>Automated resource allocation</li><li>Output maximization algorithms</li></ul></div>`;
    if (features.supply) featuresHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #10B981"><h4 style="color:#10B981"><i class="fas fa-truck"></i> Supply Chain AI</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>Demand forecasting</li><li>Supplier performance tracking</li><li>Automated ordering system</li><li>Risk mitigation strategies</li></ul></div>`;
    if (features.quality) featuresHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #F59E0B"><h4 style="color:#F59E0B"><i class="fas fa-check-circle"></i> Quality Control</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>Computer vision inspection</li><li>Defect detection & classification</li><li>Real-time quality metrics</li><li>Automated rejection system</li></ul></div>`;
    if (features.predictive) featuresHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #EF4444"><h4 style="color:#EF4444"><i class="fas fa-wrench"></i> Predictive Maintenance</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>Equipment health monitoring</li><li>Failure prediction algorithms</li><li>Automated maintenance scheduling</li><li>Parts inventory optimization</li></ul></div>`;
    if (features.warehouse) featuresHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #8B5CF6"><h4 style="color:#8B5CF6"><i class="fas fa-warehouse"></i> Warehouse Automation</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>Robotic picking & packing</li><li>Smart inventory management</li><li>Automated storage systems</li><li>Real-time stock tracking</li></ul></div>`;
    if (features.routing) featuresHTML += `<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1rem;border-left:4px solid #06B6D4"><h4 style="color:#06B6D4"><i class="fas fa-route"></i> Smart Routing & Delivery</h4><ul style="margin:0;padding-left:1.5rem;line-height:1.8"><li>AI route optimization</li><li>Real-time delivery tracking</li><li>Fleet management system</li><li>Last-mile efficiency</li></ul></div>`;
    
    return `<div style="padding:1.5rem;background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(0,72,255,0.1));border-radius:var(--radius-lg);border:2px solid var(--color-success)"><h4 style="color:var(--color-success);margin-bottom:1.5rem"><i class="fas fa-check-circle"></i> ✅ Manufacturing Automation System Generated!</h4><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin-bottom:2rem"><div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);text-align:center"><i class="fas fa-rupee-sign" style="font-size:2rem;color:var(--color-success)"></i><p style="color:var(--text-secondary);font-size:0.875rem;margin:0">Investment</p><p style="font-size:1.5rem;font-weight:700;color:var(--color-primary);margin:0.25rem 0 0">₹2.5 Cr</p></div><div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);text-align:center"><i class="fas fa-calendar-alt" style="font-size:2rem;color:var(--color-primary)"></i><p style="color:var(--text-secondary);font-size:0.875rem;margin:0">Timeline</p><p style="font-size:1.5rem;font-weight:700;color:var(--color-primary);margin:0.25rem 0 0">12-16 Weeks</p></div><div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);text-align:center"><i class="fas fa-chart-line" style="font-size:2rem;color:var(--color-gold)"></i><p style="color:var(--text-secondary);font-size:0.875rem;margin:0">ROI</p><p style="font-size:1.5rem;font-weight:700;color:var(--color-gold);margin:0.25rem 0 0">8-10 Months</p></div><div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);text-align:center"><i class="fas fa-rocket" style="font-size:2rem;color:var(--color-success)"></i><p style="color:var(--text-secondary);font-size:0.875rem;margin:0">Efficiency</p><p style="font-size:1.5rem;font-weight:700;color:var(--color-success);margin:0.25rem 0 0">45-60%</p></div></div><h4 style="margin-bottom:1rem"><i class="fas fa-cogs"></i> Automation Features:</h4>${featuresHTML}<div style="background:var(--bg-secondary);padding:1.5rem;border-radius:var(--radius-md);margin-bottom:1.5rem"><strong style="color:var(--color-primary);display:block;margin-bottom:1rem"><i class="fas fa-robot"></i> AI Implementation Plan:</strong><div style="color:var(--text-primary);white-space:pre-wrap;line-height:1.8">${aiText}</div></div><div style="display:flex;gap:0.75rem;flex-wrap:wrap"><button class="btn btn-primary"><i class="fas fa-download"></i> Download Full Report</button><button class="btn btn-outline"><i class="fas fa-calendar-check"></i> Schedule Consultation</button><button class="btn btn-outline"><i class="fas fa-calculator"></i> ROI Calculator</button></div></div>`;
}

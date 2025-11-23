// src/services/geminiService.js
// IMPROVED VERSION - Better prompts for better suggestions!

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-1.5-flash-002',
  'gemini-1.5-flash-001',
];

let currentModelIndex = 0;

async function callGemini(userPrompt, options = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error('API key not configured');
  }

  const modelId = MODELS[currentModelIndex];
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

  const requestBody = {
    contents: [{
      role: "user",
      parts: [{ text: options.systemInstruction ? `${options.systemInstruction}\n\n${userPrompt}` : userPrompt }]
    }],
    generationConfig: {
      temperature: options.temperature || 0.8, // Increased for more creative suggestions
      topK: options.topK || 40,
      topP: options.topP || 0.95,
      maxOutputTokens: options.maxOutputTokens || 2048,
      ...(modelId.includes('2.5') && { thinkingConfig: { thinkingBudget: 0 } })
    }
  };

  console.log(`🤖 Using: ${modelId}`);

  try {
    const response = await fetch(`${endpoint}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;
      
      if (response.status === 429) {
        const retryAfter = errorData.error?.message?.match(/retry in (\d+\.?\d*)/)?.[1];
        if (retryAfter) {
          console.warn(`⏳ Rate limited. Waiting ${Math.ceil(retryAfter)}s...`);
          await new Promise(resolve => setTimeout(resolve, Math.ceil(parseFloat(retryAfter)) * 1000));
          return callGemini(userPrompt, options);
        }
        throw new Error('Rate limit exceeded. Wait and try again.');
      }

      if (response.status === 404 && currentModelIndex < MODELS.length - 1) {
        console.warn(`⚠️ ${modelId} not available, trying next...`);
        currentModelIndex++;
        return callGemini(userPrompt, options);
      }

      if (response.status === 403) {
        throw new Error('API key invalid');
      }
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('No text in response');
    
    console.log(`✅ Success!`);
    return text;

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

function parseJSON(text) {
  try {
    let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/[\[{][\s\S]*[\]}]/);
    if (jsonMatch) cleaned = jsonMatch[0];
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('❌ Parse failed:', text.substring(0, 200));
    throw new Error('Could not parse response');
  }
}

// ==========================================
// IMPROVED PROMPTS
// ==========================================

export async function generateHabitSuggestions(onboardingData) {
  // IMPROVED: More context, examples, and guidance
  const systemInstruction = `You are an expert college student success coach who specializes in building sustainable habits. You understand student life - classes, exams, social life, stress, and time constraints.`;
  
  const prompt = `A college student needs help building better habits. Here's their situation:

**Their Struggles:**
${onboardingData.strugglingWith || 'General productivity and time management'}

**Current Load:**
- Taking ${onboardingData.numClasses || 'several'} classes
- Feeling overwhelmed with coursework and life balance

**Their Goals:**
${onboardingData.goals || 'Be more productive and feel less stressed'}

**Additional Context:**
${onboardingData.additionalContext || 'Typical college student schedule'}

**Your Task:**
Create 3-5 specific, actionable habits that will actually help THIS student. Make them:

1. **Specific** - Not "study more" but "Review lecture notes for 20 minutes after each class"
2. **Realistic** - Something a busy student can actually do
3. **Measurable** - Clear success criteria
4. **Impactful** - Will genuinely help with their struggles
5. **Varied** - Mix of academic, wellness, and life skills

**Good Examples:**
- "Do a 5-minute brain dump before bed to clear your mind"
- "Set phone to Do Not Disturb during first morning hour"
- "Review and organize notes within 24 hours of each lecture"
- "Take a 10-minute walk between study sessions"

**Bad Examples (too vague):**
- "Study more"
- "Be healthier"
- "Manage time better"

Return ONLY this JSON array (no other text):
[
  {
    "title": "Specific, actionable habit name (under 50 characters)",
    "description": "One sentence explaining why this helps THIS student (under 100 characters)",
    "frequency": "daily",
    "targetPunches": 10,
    "reward": "Specific, motivating reward they'd actually want"
  }
]

Rules:
- frequency: exactly "daily" or "weekly"
- targetPunches: between 5-20 (daily habits: 7-14, weekly habits: 4-8)
- rewards: specific and personal, not generic`;

  try {
    const response = await callGemini(prompt, { systemInstruction, temperature: 0.9 });
    return parseJSON(response);
  } catch (error) {
    return [{
      title: "Morning Planning Ritual",
      description: "Start each day with clarity and intention",
      frequency: "daily",
      targetPunches: 7,
      reward: "Your favorite coffee or tea ☕"
    }];
  }
}

export async function transformGoalToHabits(goalText) {
  // IMPROVED: Much more detailed with examples
  const systemInstruction = `You are a habit formation expert who helps college students break down big goals into daily actions. You understand that students need specific, achievable steps - not vague advice.`;
  
  const prompt = `A college student has this goal:

**"${goalText}"**

Help them achieve it by creating 2-3 specific habits they can track daily or weekly.

**Requirements:**
1. **Be SPECIFIC** - Turn their vague goal into concrete actions
2. **Make it MEASURABLE** - They need to know if they did it or not
3. **Keep it SIMPLE** - Students are busy, habits should be easy to start
4. **Show the CONNECTION** - Explain how this habit leads to their goal

**Examples of GOOD transformations:**

Goal: "I want to stop procrastinating"
→ Habits:
  • "Start assignments within 24 hours of receiving them (even if just reading the prompt)"
  • "Use Pomodoro: 25 min work, 5 min break, no phone during work"
  • "Plan next day's top 3 tasks every evening before bed"

Goal: "I want to be less stressed"
→ Habits:
  • "5-minute breathing exercise when you wake up"
  • "Write 3 things you're grateful for before bed"
  • "Take a 15-minute walk without your phone daily"

Goal: "I want better grades"
→ Habits:
  • "Review and summarize each lecture within 24 hours"
  • "Complete practice problems before looking at solutions"
  • "Teach concepts to a friend or rubber duck weekly"

**Examples of BAD transformations (too vague):**
❌ "Study more effectively"
❌ "Manage time better"
❌ "Take care of yourself"

Now transform their goal: "${goalText}"

Return ONLY this JSON array:
[
  {
    "title": "Specific action they can do (under 60 characters)",
    "description": "One sentence: how this helps achieve '${goalText}' (under 120 characters)",
    "frequency": "daily",
    "targetPunches": 10
  }
]

Rules:
- frequency: exactly "daily" or "weekly" 
- targetPunches: 5-20 (daily: 7-14, weekly: 4-8)
- title: Must be a specific, measurable action
- description: Must connect back to their original goal`;

  try {
    const response = await callGemini(prompt, { systemInstruction, temperature: 0.85 });
    const habits = parseJSON(response);
    console.log('✅ Generated habits:', habits);
    return habits;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function generateThemeFromDescription(description) {
  // IMPROVED: More creative and specific
  const systemInstruction = `You are a UI/UX designer who creates beautiful, harmonious color palettes. You understand color theory, psychology, and what makes interfaces feel good.`;
  
  const prompt = `Create a beautiful color theme based on this vibe:

**"${description}"**

Think about:
- What emotions does this evoke?
- What colors naturally fit this mood?
- How can colors complement each other?

**Good color pairings:**
- Ocean sunset: Coral pink (#FF6B9D) + Turquoise (#4ECDC4)
- Forest morning: Sage green (#87A96B) + Soft gold (#FFD97D)
- Starry night: Deep purple (#6C5CE7) + Pale blue (#A8D8EA)
- Cherry blossom: Soft pink (#FFB6C1) + Cream (#FFF8DC)

Return ONLY this JSON:
{
  "name": "Creative, evocative name (2-3 words)",
  "primary": "#HEX_COLOR",
  "secondary": "#HEX_COLOR",
  "emoji": "Perfect emoji for this vibe",
  "description": "Poetic one-sentence description"
}

Use real hex colors that complement each other beautifully.`;

  try {
    const response = await callGemini(prompt, { systemInstruction, temperature: 0.95 });
    const theme = parseJSON(response);
    
    const hexRegex = /^#[0-9A-F]{6}$/i;
    return {
      name: theme.name || 'Custom',
      primary: hexRegex.test(theme.primary) ? theme.primary : '#8B5CF6',
      secondary: hexRegex.test(theme.secondary) ? theme.secondary : '#EC4899',
      emoji: theme.emoji || '⭐',
      description: theme.description || description
    };
  } catch (error) {
    return null;
  }
}

export async function analyzeReflection(reflectionText, habits, completionData) {
  // IMPROVED: More empathetic and actionable
  const habitsSummary = habits.map(h => 
    `• ${h.title}: ${h.currentPunches}/${h.targetPunches} punches (${Math.round((h.currentPunches / h.targetPunches) * 100)}%)`
  ).join('\n');

  const systemInstruction = `You are a supportive life coach for college students. You're empathetic, understanding, and give practical advice. You celebrate progress and help students learn from setbacks without being judgmental.`;

  const prompt = `A college student is reflecting on their week:

**Their Reflection:**
"${reflectionText}"

**Their Progress:**
${habitsSummary}

**Your Role:**
Respond with empathy and actionable advice. Be their supportive coach.

**Give 2-3 specific suggestions:**
✅ GOOD: "Try doing your hardest habit first thing in the morning when your willpower is highest"
✅ GOOD: "Your 3/10 completion suggests the habit might be too ambitious - try cutting it to 2/10 next week"
❌ BAD: "You need to be more disciplined"
❌ BAD: "Try harder next time"

**Write an encouraging message (2-3 sentences):**
✅ GOOD: "I can see you're really trying, and that matters more than perfect completion. Building habits is tough, especially with everything else you're managing. Let's adjust to make next week easier."
❌ BAD: "Good job, keep it up."

Return ONLY this JSON:
{
  "suggestions": [
    "Specific, actionable tip with reasoning",
    "Another concrete suggestion",
    "One more helpful tip"
  ],
  "message": "Warm, personal, empathetic message that acknowledges their effort"
}`;

  try {
    const response = await callGemini(prompt, { systemInstruction, temperature: 0.85 });
    return parseJSON(response);
  } catch (error) {
    return {
      suggestions: [
        "Try scheduling your toughest habit for when you have the most energy (usually mornings)",
        "If you're consistently missing a habit, make it smaller - 10 minutes instead of 30",
        "Celebrate completing even one punch - progress isn't all-or-nothing"
      ],
      message: "Building new habits is hard, but you're showing up and trying. That's what matters most. Be patient with yourself!"
    };
  }
}

export async function generateRewardIdeas(habitTitle, userPreferences = '') {
  // IMPROVED: More personalized and creative
  const systemInstruction = `You are a motivational expert who understands what actually motivates college students. You suggest rewards that are specific, achievable, and genuinely exciting.`;
  
  const prompt = `Suggest rewards for completing this habit:

**Habit:** "${habitTitle}"
${userPreferences ? `**Preferences:** ${userPreferences}` : ''}

**Requirements:**
- Mix of FREE and low-cost options
- Specific, not generic
- Actually motivating for college students
- Varied (treats, experiences, purchases, self-care)

**Good Examples:**
✅ "Order your favorite boba drink 🧋"
✅ "Buy that game you've been eyeing on Steam 🎮"
✅ "Take a guilt-free 2-hour nap 😴"
✅ "Watch 2 episodes of your show with snacks 📺"

**Bad Examples (too vague):**
❌ "Treat yourself"
❌ "Do something nice"
❌ "Relax"

Return ONLY this JSON array (4-5 rewards):
["Specific reward with emoji 🎉", "Another specific reward 🎮", ...]`;

  try {
    const response = await callGemini(prompt, { systemInstruction, temperature: 0.9 });
    return parseJSON(response);
  } catch (error) {
    return [
      "Your favorite coffee or boba drink 🧋",
      "30 minutes of guilt-free social media time 📱",
      "Order from your favorite restaurant 🍕",
      "Buy that item under $20 you've wanted 🛍️"
    ];
  }
}

export async function testGeminiConnection() {
  console.log('🧪 Testing...');
  try {
    const response = await callGemini('Respond: {"status":"ok","message":"Works!"}');
    const result = parseJSON(response);
    return {
      success: true,
      message: '✅ Working!',
      model: MODELS[currentModelIndex],
      response: result
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ${error.message}`,
      model: MODELS[currentModelIndex]
    };
  }
}

export function getAPIStatus() {
  return {
    hasAPIKey: !!GEMINI_API_KEY,
    currentModel: MODELS[currentModelIndex],
    availableModels: MODELS
  };
}
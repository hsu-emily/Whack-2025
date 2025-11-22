// Gemini AI Service
// Note: You'll need to add VITE_GEMINI_API_KEY to your .env file

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Call Gemini API with a prompt
 */
async function callGemini(prompt, systemInstruction = null) {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not found. Add VITE_GEMINI_API_KEY to your .env file');
    return null;
  }

  try {
    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || null;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
}

/**
 * Generate habit suggestions from onboarding answers
 */
export async function generateHabitSuggestions(onboardingData) {
  const prompt = `You are a helpful habit coach for college students. Based on the following student information, suggest 3-5 specific, actionable habits that would help them.

Student Information:
- Struggling with: ${onboardingData.strugglingWith || 'not specified'}
- Number of classes: ${onboardingData.numClasses || 'not specified'}
- Big goals this month: ${onboardingData.goals || 'not specified'}
- Additional context: ${onboardingData.additionalContext || 'none'}

For each habit, provide:
1. A clear, specific habit name (e.g., "Review lecture notes for 15 minutes")
2. Suggested frequency (daily or weekly)
3. Suggested punch count (5-20 punches per reward cycle)
4. A meaningful reward idea

Return your response as a JSON array with this exact format:
[
  {
    "title": "Habit name",
    "description": "Brief description",
    "frequency": "daily" or "weekly",
    "targetPunches": number,
    "reward": "Reward description"
  }
]`;

  const response = await callGemini(prompt);
  if (!response) return [];

  try {
    // Extract JSON from response (Gemini sometimes adds markdown formatting)
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : response;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return [];
  }
}

/**
 * Transform a goal into specific habit suggestions
 */
export async function transformGoalToHabits(goalText) {
  const prompt = `A student wants to achieve this goal: "${goalText}"

Transform this into 2-3 specific, actionable habits that would help them reach this goal. Each habit should be:
- Specific and measurable
- Realistic for a college student
- Actionable (something they can do daily or weekly)

Return as JSON array:
[
  {
    "title": "Habit name",
    "description": "Why this helps",
    "frequency": "daily" or "weekly",
    "targetPunches": number (5-20)
  }
]`;

  const response = await callGemini(prompt);
  if (!response) return [];

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : response;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return [];
  }
}

/**
 * Generate theme from text description
 */
export async function generateThemeFromDescription(description) {
  const prompt = `A student wants a theme for their habit card. They described it as: "${description}"

Generate a color palette and style that matches this vibe. Return a JSON object with:
{
  "name": "Theme name (e.g., 'Celestial Calm', 'Ocean Breeze')",
  "primary": "hex color code",
  "secondary": "hex color code",
  "emoji": "relevant emoji",
  "description": "brief style description"
}

Make the colors harmonious and visually appealing.`;

  const response = await callGemini(prompt);
  if (!response) return null;

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : response;
    const theme = JSON.parse(jsonStr);
    
    // Validate and set defaults
    return {
      name: theme.name || 'Custom Theme',
      primary: theme.primary || '#8B5CF6',
      secondary: theme.secondary || '#EC4899',
      emoji: theme.emoji || '⭐',
      description: theme.description || description
    };
  } catch (error) {
    console.error('Error parsing theme response:', error);
    return null;
  }
}

/**
 * Analyze weekly reflection and provide AI coach feedback
 */
export async function analyzeReflection(reflectionText, habits, completionData) {
  const habitsSummary = habits.map(h => ({
    name: h.title,
    target: h.targetPunches,
    current: h.currentPunches,
    completionRate: Math.round((h.currentPunches / h.targetPunches) * 100)
  })).join('\n');

  const prompt = `You are a supportive, empathetic AI coach for college students. A student just shared this weekly reflection:

"${reflectionText}"

Their habit progress this week:
${habitsSummary}

Provide:
1. 2-3 concrete, actionable suggestions for improving their habits (e.g., "Reduce '60 min study block' to 30 min", "Move your hardest habit earlier in the day")
2. One short, empathetic message (2-3 sentences) that acknowledges their effort and encourages them

Return as JSON:
{
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "message": "empathetic message here"
}`;

  const response = await callGemini(prompt);
  if (!response) return null;

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : response;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing reflection analysis:', error);
    return null;
  }
}

/**
 * Generate reward ideas based on habit and user preferences
 */
export async function generateRewardIdeas(habitTitle, userPreferences = '') {
  const prompt = `Suggest 3-5 meaningful reward ideas for completing this habit: "${habitTitle}"

${userPreferences ? `User preferences: ${userPreferences}` : ''}

Make rewards:
- Appropriate for a college student
- Meaningful and motivating
- Varied (some free, some small cost)

Return as JSON array: ["reward 1", "reward 2", "reward 3"]`;

  const response = await callGemini(prompt);
  if (!response) return [];

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : response;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing reward ideas:', error);
    return [];
  }
}


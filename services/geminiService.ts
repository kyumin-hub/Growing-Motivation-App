import { GoogleGenAI } from "@google/genai";

// Initialize Gemini safely
// This ensures the app doesn't crash if process.env is undefined in some browser environments
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';

// Create AI instance only if key exists, otherwise we'll handle gracefully in functions
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Generates a warm, short encouraging message.
 */
export const getWarmMessage = async (userContext: string): Promise<string> => {
  if (!ai) {
    return "오늘 하루도 당신은 충분히 잘하고 있어요.";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are a gentle, supportive mental health counselor and friend. 
      The user is feeling a bit low or unmotivated. 
      Context: ${userContext}.
      Write a VERY SHORT, warm, and encouraging message in Korean (Keep it under 40 characters).
      Do not give advice, just offer comfort and validation.
      Use a soft, friendly tone (해요체).`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "오늘 하루도 당신은 충분히 잘하고 있어요.";
  }
};

/**
 * Generates 3 very easy micro-missions based on user mood.
 */
export const getSuggestedMissions = async (): Promise<string[]> => {
  // Fallback defaults if AI is not configured or fails
  const defaults = ["물 한 모금 마시기", "기지개 켜기", "창문 열어보기"];
  
  if (!ai) {
    return defaults;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Suggest 3 extremely easy, micro-tasks for someone dealing with depression or burnout.
      Examples: "Drink a sip of water", "Stretch for 5 seconds", "Look out the window".
      The goal is to help them feel a tiny sense of achievement.
      Return ONLY a JSON array of strings in Korean. No markdown.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text.trim();
    // Clean up if model adds markdown blocks despite config
    const jsonStr = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const missions = JSON.parse(jsonStr);
    
    if (Array.isArray(missions)) {
      return missions.slice(0, 3);
    }
    return defaults;
  } catch (error) {
    console.error("Gemini Mission Error:", error);
    return ["물 한 모금 마시기", "눈 감고 10초 쉬기", "손가락 스트레칭 하기"];
  }
};
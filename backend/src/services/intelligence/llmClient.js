import axios from 'axios';
import { config } from '../../config/index.js';

/**
 * Robust LLM Client with Gemini API integration and fallback to structured heuristic intelligence.
 */
export async function callGeminiLlm({ systemPrompt, userPrompt, temperature = 0.2 }) {
  if (!config.geminiApiKey) {
    return { success: false, reason: 'NO_API_KEY_CONFIGURED' };
  }

  try {
    // Standard Gemini 1.5/2.0 REST endpoint
    const model = config.geminiModel || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n---\nUSER REQUEST / SOURCES:\n${userPrompt}` }]
        }
      ],
      generationConfig: {
        temperature: temperature,
        responseMimeType: 'application/json',
        maxOutputTokens: 4096
      }
    };

    const response = await axios.post(url, payload, {
      timeout: 25000,
      headers: { 'Content-Type': 'application/json' }
    });

    const candidate = response.data?.candidates?.[0];
    const textOutput = candidate?.content?.parts?.[0]?.text;

    if (!textOutput) {
      return { success: false, reason: 'EMPTY_RESPONSE_FROM_GEMINI' };
    }

    // Parse JSON safely
    const parsed = JSON.parse(textOutput);
    return { success: true, data: parsed, raw: textOutput };
  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || err.message;
    return { success: false, reason: errorMsg };
  }
}

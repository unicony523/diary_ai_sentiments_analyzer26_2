import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';

if (!apiKey) {
  console.warn('Warning: GOOGLE_GENERATIVE_AI_API_KEY is not set.');
}

export const ai = new GoogleGenAI({ apiKey });

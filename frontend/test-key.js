import { GoogleGenAI } from '@google/genai';

async function test() {
  try {
    console.log("Testing with key from environment variable GEMINI_API_KEY...");
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Say hi'
    });
    console.log("SUCCESS:", response.text);
  } catch (e) {
    console.error("ERROR:");
    console.error(e);
  }
}

test();

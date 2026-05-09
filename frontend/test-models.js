import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({});
  
  const modelsToTest = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];
  
  for (const model of modelsToTest) {
    try {
      console.log(`Testing with ${model}...`);
      const response = await ai.models.generateContent({
        model: model,
        contents: 'Say hi'
      });
      console.log(`SUCCESS with ${model}:`, response.text);
      return; // Stop on first success
    } catch (e) {
      console.error(`FAILED with ${model}:`, e.message || e.status || e);
    }
  }
}

test();

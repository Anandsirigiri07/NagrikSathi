import { GoogleGenAI } from '@google/genai';

async function listModels() {
  try {
    const ai = new GoogleGenAI({});
    const models = await ai.models.list();
    console.log("Available models:");
    for await (const model of models) {
      if (model.name.includes("gemini")) {
        console.log(model.name);
      }
    }
  } catch (e) {
    console.error("ERROR listing models:", e.message || e);
  }
}

listModels();

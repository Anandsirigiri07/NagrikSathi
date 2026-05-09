import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const MODEL = 'gemini-flash-latest';

const callGemini = async (prompt, imageBase64, mimeType) => {
  try {
    const parts = [{ text: prompt }];
    if (imageBase64 && mimeType) {
      parts.push({ inlineData: { mimeType, data: imageBase64 } });
    }
    const response = await genAI.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts }],
    });
    return response.text || 'No response generated.';
  } catch (err) {
    console.error('Gemini API error:', err);
    return 'AI service is currently unavailable. Please try again later.';
  }
};

export const detectScam = async (message, language) => {
  const prompt = `You are an Indian scam detection expert. Analyze this message for scam patterns common in India (UPI fraud, OTP scams, fake KYC, lottery scams, job scams, loan app scams, electricity disconnection threats, etc).

Message: "${message}"

Respond in ${language} language. Return ONLY valid JSON:
{"verdict":"safe|suspicious|scam","confidence":0-100,"explanation":"why this is/isn't a scam","scamType":"type of scam or none","advice":"what the user should do"}`;

  const result = await callGemini(prompt);
  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { verdict: 'suspicious', confidence: 50, explanation: result, scamType: 'unknown', advice: 'Be cautious.' };
  }
};

export const analyzeDocument = async (imageBase64, mimeType, language) => {
  const prompt = `You are an expert in Indian government and legal documents. Analyze this document image. Extract all important information efficiently and explain it in simple ${language} language that even a non-educated person can easily understand. Be concise but highly accurate.

Respond ONLY in valid JSON:
{"title":"document type/title","summary":"simple explanation of what this document says and means","actionItems":["what the person needs to do immediately"],"deadlines":["any critical dates/deadlines mentioned"],"department":"which government department issued this"}`;

  const result = await callGemini(prompt, imageBase64, mimeType);
  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { title: 'Document', summary: result, actionItems: [], deadlines: [], department: 'Unknown' };
  }
};

export const generateRTI = async (userQuery, language) => {
  const prompt = `You are an expert RTI (Right to Information) advisor in India. A citizen wants to know: "${userQuery}"

Generate a legally valid RTI application in ${language}. Include:
1. The correct government department to address
2. Proper RTI format with all required sections
3. Step-by-step filing instructions

Respond ONLY in valid JSON:
{"department":"correct department name","pio":"Public Information Officer title","application":"full RTI application text ready to submit","filingSteps":["step 1","step 2","step 3"],"fee":"application fee details"}`;

  const result = await callGemini(prompt);
  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { department: '', pio: '', application: result, filingSteps: [], fee: '₹10' };
  }
};

export const analyzePriceQuote = async (material, brand, price, priceUnit, quantity, unit, city, language, imageBase64, mimeType) => {
  const prompt = `Indian Construction Cost Expert: City=${city}, Material=${material}, Brand=${brand}, Qty=${quantity} ${unit}.
User entered Price: ₹${price} (${priceUnit}).
${imageBase64 ? 'Analyze attached image (bill/material) for brand/quality.' : ''}
Compare to 2025 Indian market rates. Factor in brand premiums and bulk discounts. Calculate whether the user's entered price is fair.
Response MUST be strict minified JSON in ${language}:
{"verdict":"fair|overpriced|underpriced","avgPrice":estimated_fair_price_for_the_same_pricing_unit,"difference":"% diff","advice":"Short per-unit breakdown + bulk discount advice"}`;

  const result = await callGemini(prompt, imageBase64, mimeType);
  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { verdict: 'fair', avgPrice: price, difference: '0%', advice: result };
  }
};

export const detectMaterialFromImage = async (imageBase64, mimeType) => {
  const prompt = `Analyze Indian construction material/bill image.
Identify: material (cement|steel|sand|bricks|paint|tiles), brand (e.g. UltraTech, Tata Tiscon, Asian Paints or 'Local'), quantity (number), and unit (e.g. bag, kg, ton, cft, pieces, liter).
Response MUST be strict minified JSON, no markdown, no other text:
{"material":"detected_material","brand":"detected_brand","quantity":"number","unit":"unit"}`;

  const result = await callGemini(prompt, imageBase64, mimeType);
  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { material: 'cement', brand: 'Local', quantity: '1', unit: '50kg bag' };
  }
};

export const predictWaterTiming = async (logs, area, language) => {
  const prompt = `You are analyzing municipal water supply patterns in India. Based on these recent water arrival timestamps for area "${area}":
${logs.join('\n')}

Predict when water will most likely arrive next. Respond in ${language}.

Return ONLY valid JSON:
{"prediction":"predicted time like 5:30 AM","confidence":"high/medium/low","pattern":"description of the pattern you noticed"}`;

  const result = await callGemini(prompt);
  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { prediction: 'Unable to predict', confidence: 'low', pattern: result };
  }
};

export const analyzeMedicine = async (imageBase64, mimeType, language) => {
  const prompt = `You are a highly accurate Indian pharmacist. Analyze this medicine image with 95%+ accuracy.
Provide: 1. The medicine name. 2. Its main purpose in simple terms. 3. A cheaper generic alternative (Jan Aushadhi equivalent if possible). 4. Estimated cost savings percentage.
Respond entirely in ${language}. Return ONLY valid JSON, no markdown, no other text:
{"medicineName":"name","purpose":"what it treats","genericAlternative":"cheaper alternative","estimatedSavings":"e.g. 50-70%"}`;

  const result = await callGemini(prompt, imageBase64, mimeType);
  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { medicineName: 'Unknown', purpose: result, genericAlternative: 'Not found', estimatedSavings: '0%' };
  }
};

export const analyzeTrafficOrConsumerIssue = async (issue, type, language) => {
  const prompt = `You are an expert Indian lawyer providing advice with 95%+ accuracy.
Scenario: ${type === 'traffic' ? 'Traffic Police Stop' : 'Consumer Rights Dispute'}
Issue: "${issue}"
Provide: 1. Practical advice. 2. Exact official fine amounts (if traffic) or exact basic rights (if consumer). 3. A formal draft (complaint letter if consumer, or polite statement if traffic).
Respond entirely in ${language}. Return ONLY valid JSON, nothing else:
{"advice":"what to do right now","fineOrRights":"details of fines/rights","draft":"formal draft text"}`;

  const result = await callGemini(prompt);
  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { advice: result, fineOrRights: 'Unknown', draft: '' };
  }
};

export const findGovtSchemes = async (age, gender, income, occupation, language) => {
  const prompt = `You are an Indian Government Welfare Scheme expert.
User Profile: Age: ${age}, Gender: ${gender}, Annual Income: ₹${income}, Occupation: ${occupation}.
Analyze the demographic data with 95%+ accuracy to find the top 3 best matching state or central government schemes for this specific person.
Respond entirely in ${language}. Return ONLY valid JSON, nothing else:
{"schemes":[{"name":"Scheme Name","benefits":"Key benefits","eligibility":"Why they qualify","howToApply":"Steps or portal"}]}`;

  const result = await callGemini(prompt);
  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { schemes: [] };
  }
};

export const analyzeElectricityBill = async (imageBase64, mimeType, language) => {
  const prompt = `You are an Indian electricity board expert. Analyze this electricity bill or meter reading image with 95%+ accuracy.
Extract the exact total amount. Explain the unit slabs simply. Accurately highlight if the reading/bill looks unusually high (anomaly). Give actionable advice to reduce the bill or dispute it.
Respond entirely in ${language}. Return ONLY valid JSON, no markdown, no other text:
{"totalAmount":"amount","slabBreakdown":"simple explanation","anomalyDetected":true/false,"advice":"actionable tip"}`;

  const result = await callGemini(prompt, imageBase64, mimeType);
  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { totalAmount: 'Unknown', slabBreakdown: result, anomalyDetected: false, advice: 'Please check manually.' };
  }
};

export const analyzeCropDisease = async (imageBase64, mimeType, language) => {
  const prompt = `You are an expert Indian agricultural scientist (Krishi Mitra). Analyze this crop image with 95%+ accuracy.
Identify the exact disease. Determine the severity. Suggest highly effective local/generic pesticide or organic treatment. Give proven preventive advice.
Respond entirely in ${language}. Return ONLY valid JSON, no markdown, no other text:
{"disease":"disease name","severity":"Low/Medium/High","treatment":"chemical or organic solution","preventiveMeasures":"how to avoid next time"}`;

  const result = await callGemini(prompt, imageBase64, mimeType);
  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { disease: 'Unknown', severity: 'Unknown', treatment: result, preventiveMeasures: '' };
  }
};

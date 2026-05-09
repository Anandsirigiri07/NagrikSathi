const API_BASE_URL = 'http://localhost:5000/api/ai';

const callBackendAPI = async (endpoint: string, payload: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`Error calling ${endpoint}:`, err);
    throw err;
  }
};

export const detectScam = async (message: string, language: string): Promise<{
  verdict: 'safe' | 'suspicious' | 'scam';
  confidence: number;
  explanation: string;
  scamType: string;
  advice: string;
}> => {
  return callBackendAPI('/detect-scam', { message, language });
};

export const analyzeDocument = async (imageBase64: string, mimeType: string, language: string): Promise<{
  title: string;
  summary: string;
  actionItems: string[];
  deadlines: string[];
  department: string;
}> => {
  return callBackendAPI('/analyze-document', { imageBase64, mimeType, language });
};

export const generateRTI = async (userQuery: string, language: string): Promise<{
  department: string;
  pio: string;
  application: string;
  filingSteps: string[];
  fee: string;
}> => {
  return callBackendAPI('/generate-rti', { userQuery, language });
};

export const analyzePriceQuote = async (material: string, brand: string, price: number, priceUnit: string, quantity: number, unit: string, city: string, language: string, imageBase64?: string, mimeType?: string): Promise<{
  verdict: 'fair' | 'overpriced' | 'underpriced';
  avgPrice: number;
  difference: string;
  advice: string;
}> => {
  return callBackendAPI('/analyze-price-quote', { material, brand, price, priceUnit, quantity, unit, city, language, imageBase64, mimeType });
};

export const detectMaterialFromImage = async (imageBase64: string, mimeType: string): Promise<{
  material: string;
  brand: string;
  quantity: string;
  unit: string;
}> => {
  return callBackendAPI('/detect-material-from-image', { imageBase64, mimeType });
};

export const predictWaterTiming = async (logs: string[], area: string, language: string): Promise<{
  prediction: string;
  confidence: string;
  pattern: string;
}> => {
  return callBackendAPI('/predict-water-timing', { logs, area, language });
};

export const analyzeMedicine = async (imageBase64: string, mimeType: string, language: string): Promise<{
  medicineName: string;
  purpose: string;
  genericAlternative: string;
  estimatedSavings: string;
}> => {
  return callBackendAPI('/analyze-medicine', { imageBase64, mimeType, language });
};

export const analyzeTrafficOrConsumerIssue = async (issue: string, type: 'traffic' | 'consumer', language: string): Promise<{
  advice: string;
  draft: string;
  fineOrRights: string;
}> => {
  return callBackendAPI('/analyze-traffic-consumer-issue', { issue, type, language });
};

export const findGovtSchemes = async (age: string, gender: string, income: string, occupation: string, language: string): Promise<{
  schemes: Array<{ name: string; benefits: string; eligibility: string; howToApply: string }>;
}> => {
  return callBackendAPI('/find-govt-schemes', { age, gender, income, occupation, language });
};

export const analyzeElectricityBill = async (imageBase64: string, mimeType: string, language: string): Promise<{
  totalAmount: string;
  slabBreakdown: string;
  anomalyDetected: boolean;
  advice: string;
}> => {
  return callBackendAPI('/analyze-electricity-bill', { imageBase64, mimeType, language });
};

export const analyzeCropDisease = async (imageBase64: string, mimeType: string, language: string): Promise<{
  disease: string;
  severity: string;
  treatment: string;
  preventiveMeasures: string;
}> => {
  return callBackendAPI('/analyze-crop-disease', { imageBase64, mimeType, language });
};

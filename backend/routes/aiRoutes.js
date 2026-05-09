import express from 'express';
import {
  detectScam,
  analyzeDocument,
  generateRTI,
  analyzePriceQuote,
  detectMaterialFromImage,
  predictWaterTiming,
  analyzeMedicine,
  analyzeTrafficOrConsumerIssue,
  findGovtSchemes,
  analyzeElectricityBill,
  analyzeCropDisease,
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/detect-scam', async (req, res) => {
  const { message, language } = req.body;
  const result = await detectScam(message, language);
  res.json(result);
});

router.post('/analyze-document', async (req, res) => {
  const { imageBase64, mimeType, language } = req.body;
  const result = await analyzeDocument(imageBase64, mimeType, language);
  res.json(result);
});

router.post('/generate-rti', async (req, res) => {
  const { userQuery, language } = req.body;
  const result = await generateRTI(userQuery, language);
  res.json(result);
});

router.post('/analyze-price-quote', async (req, res) => {
  const { material, brand, price, priceUnit, quantity, unit, city, language, imageBase64, mimeType } = req.body;
  const result = await analyzePriceQuote(material, brand, price, priceUnit, quantity, unit, city, language, imageBase64, mimeType);
  res.json(result);
});

router.post('/detect-material-from-image', async (req, res) => {
  const { imageBase64, mimeType } = req.body;
  const result = await detectMaterialFromImage(imageBase64, mimeType);
  res.json(result);
});

router.post('/predict-water-timing', async (req, res) => {
  const { logs, area, language } = req.body;
  const result = await predictWaterTiming(logs, area, language);
  res.json(result);
});

router.post('/analyze-medicine', async (req, res) => {
  const { imageBase64, mimeType, language } = req.body;
  const result = await analyzeMedicine(imageBase64, mimeType, language);
  res.json(result);
});

router.post('/analyze-traffic-consumer-issue', async (req, res) => {
  const { issue, type, language } = req.body;
  const result = await analyzeTrafficOrConsumerIssue(issue, type, language);
  res.json(result);
});

router.post('/find-govt-schemes', async (req, res) => {
  const { age, gender, income, occupation, language } = req.body;
  const result = await findGovtSchemes(age, gender, income, occupation, language);
  res.json(result);
});

router.post('/analyze-electricity-bill', async (req, res) => {
  const { imageBase64, mimeType, language } = req.body;
  const result = await analyzeElectricityBill(imageBase64, mimeType, language);
  res.json(result);
});

router.post('/analyze-crop-disease', async (req, res) => {
  const { imageBase64, mimeType, language } = req.body;
  const result = await analyzeCropDisease(imageBase64, mimeType, language);
  res.json(result);
});

export default router;

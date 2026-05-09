export type Language = 'en'|'hi'|'ta'|'te'|'bn'|'mr'|'gu'|'kn'|'ml'|'pa'|'or'|'ur';

export const languageNames: Record<Language, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  hi: { native: 'हिन्दी', english: 'Hindi' },
  ta: { native: 'தமிழ்', english: 'Tamil' },
  te: { native: 'తెలుగు', english: 'Telugu' },
  bn: { native: 'বাংলা', english: 'Bengali' },
  mr: { native: 'मराठी', english: 'Marathi' },
  gu: { native: 'ગુજરાતી', english: 'Gujarati' },
  kn: { native: 'ಕನ್ನಡ', english: 'Kannada' },
  ml: { native: 'മലയാളം', english: 'Malayalam' },
  pa: { native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  or: { native: 'ଓଡ଼ିଆ', english: 'Odia' },
  ur: { native: 'اردو', english: 'Urdu' },
};

interface Translations {
  appName: string; tagline: string; welcome: string; signInGoogle: string; signInPhone: string;
  enterPhone: string; enterOTP: string; sendOTP: string; verifyOTP: string; signOut: string;
  selectLanguage: string; chooseLanguage: string;
  dashboard: string; jalGuru: string; dastavez: string; scamKavach: string; rtiSaathi: string; nirmaanMitra: string;
  medMitra: string; kanoonSaathi: string; yojanaSetu: string; bijliMitra: string; krishiSalahkar: string;
  jalDesc: string; dastavezDesc: string; scamDesc: string; rtiDesc: string; nirmaanDesc: string;
  medDesc: string; kanoonDesc: string; yojanaDesc: string; bijliDesc: string; krishiDesc: string;
  waterArrived: string; tapWhenWater: string; recentLogs: string; prediction: string; nextWater: string;
  uploadDoc: string; takePhoto: string; analyzing: string; actionItems: string; deadlines: string;
  pasteMessage: string; checkScam: string; checking: string; safe: string; suspicious: string; scam: string; reportScam: string;
  whatToKnow: string; generateRTI: string; generating: string; department: string; filingSteps: string; downloadRTI: string;
  selectMaterial: string; enterPrice: string; checkPrice: string; perBag: string; fairPrice: string; overpriced: string;
  cement: string; steel: string; sand: string; bricks: string; paint: string; tiles: string;
  city: string; area: string; loading: string; error: string; success: string; retry: string; save: string; share: string;
  guideTitle: string; guideStep1: string; guideStep2: string; guideStep3: string; closeGuide: string;
}

const en: Translations = {
  appName: 'NagrikSathi', tagline: "India's Citizen Companion",
  welcome: 'Welcome, Citizen!', signInGoogle: 'Sign in with Google', signInPhone: 'Sign in with Phone',
  enterPhone: 'Enter phone number (+91)', enterOTP: 'Enter OTP', sendOTP: 'Send OTP', verifyOTP: 'Verify OTP', signOut: 'Sign Out',
  selectLanguage: 'Select Your Language', chooseLanguage: 'Choose your preferred language',
  dashboard: 'Home', jalGuru: 'JalGuru', dastavez: 'DastavezAI', scamKavach: 'ScamKavach', rtiSaathi: 'RTI Saathi', nirmaanMitra: 'NirmaanMitra',
  medMitra: 'MedMitra', kanoonSaathi: 'KanoonSaathi', yojanaSetu: 'YojanaSetu', bijliMitra: 'BijliMitra', krishiSalahkar: 'KrishiSalahkar',
  jalDesc: 'Predict water supply timing', dastavezDesc: 'Decode government documents', scamDesc: 'Detect fraud messages', rtiDesc: 'Auto-file RTI applications', nirmaanDesc: 'Track construction material prices',
  medDesc: 'Find generic medicines', kanoonDesc: 'Know your legal rights', yojanaDesc: 'Find govt schemes', bijliDesc: 'Analyze electricity bills', krishiDesc: 'Detect crop diseases',
  waterArrived: 'Water Arrived!', tapWhenWater: 'Tap when water comes', recentLogs: 'Recent Logs', prediction: 'AI Prediction', nextWater: 'Next water expected at',
  uploadDoc: 'Upload or capture document', takePhoto: 'Take Photo', analyzing: 'Analyzing document...', actionItems: 'What you need to do', deadlines: 'Important dates',
  pasteMessage: 'Paste suspicious message here...', checkScam: 'Check for Scam', checking: 'Analyzing...', safe: 'Safe ✅', suspicious: 'Suspicious ⚠️', scam: 'SCAM 🚨', reportScam: 'Report Scam',
  whatToKnow: 'What do you want to know from the government?', generateRTI: 'Generate RTI Application', generating: 'Generating...', department: 'Department', filingSteps: 'How to file', downloadRTI: 'Download RTI',
  selectMaterial: 'Select Material', enterPrice: 'Enter quoted price (₹)', checkPrice: 'Check Price', perBag: 'per bag', fairPrice: 'Fair Price', overpriced: 'Overpriced!',
  cement: 'Cement', steel: 'Steel', sand: 'Sand', bricks: 'Bricks', paint: 'Paint', tiles: 'Tiles',
  city: 'City', area: 'Area / Locality', loading: 'Loading...', error: 'Something went wrong', success: 'Success!', retry: 'Retry', save: 'Save', share: 'Share',
  guideTitle: 'How to use NagrikSathi', guideStep1: 'Step 1: Choose your preferred language from the top menu.', guideStep2: 'Step 2: Select a service card from the dashboard.', guideStep3: 'Step 3: Follow the simple instructions to get AI assistance.', closeGuide: 'Got it!',
};

const hi: Translations = {
  appName: 'नागरिक साथी', tagline: 'भारत का नागरिक साथी',
  welcome: 'स्वागत है, नागरिक!', signInGoogle: 'Google से लॉगिन', signInPhone: 'फ़ोन से लॉगिन',
  enterPhone: 'फ़ोन नंबर दर्ज करें (+91)', enterOTP: 'OTP दर्ज करें', sendOTP: 'OTP भेजें', verifyOTP: 'OTP सत्यापित करें', signOut: 'लॉग आउट',
  selectLanguage: 'अपनी भाषा चुनें', chooseLanguage: 'अपनी पसंदीदा भाषा चुनें',
  dashboard: 'होम', jalGuru: 'जलगुरु', dastavez: 'दस्तावेज़AI', scamKavach: 'स्कैम कवच', rtiSaathi: 'RTI साथी', nirmaanMitra: 'निर्माण मित्र',
  medMitra: 'मेड मित्र', kanoonSaathi: 'कानून साथी', yojanaSetu: 'योजना सेतु', bijliMitra: 'बिजली मित्र', krishiSalahkar: 'कृषि सलाहकार',
  jalDesc: 'पानी आने का समय जानें', dastavezDesc: 'सरकारी दस्तावेज़ समझें', scamDesc: 'फ्रॉड मैसेज पहचानें', rtiDesc: 'RTI आवेदन बनाएं', nirmaanDesc: 'निर्माण सामग्री के दाम जानें',
  medDesc: 'जेनेरिक दवाएं खोजें', kanoonDesc: 'अपने कानूनी अधिकार जानें', yojanaDesc: 'सरकारी योजनाएं खोजें', bijliDesc: 'बिजली बिल समझें', krishiDesc: 'फसल रोग पहचानें',
  waterArrived: 'पानी आ गया!', tapWhenWater: 'पानी आने पर दबाएं', recentLogs: 'हाल के रिकॉर्ड', prediction: 'AI अनुमान', nextWater: 'अगला पानी अनुमानित समय',
  uploadDoc: 'दस्तावेज़ अपलोड या फोटो लें', takePhoto: 'फ़ोटो लें', analyzing: 'दस्तावेज़ विश्लेषण...', actionItems: 'आपको क्या करना है', deadlines: 'महत्वपूर्ण तारीखें',
  pasteMessage: 'संदिग्ध संदेश यहाँ पेस्ट करें...', checkScam: 'स्कैम जांचें', checking: 'जाँच रहा है...', safe: 'सुरक्षित ✅', suspicious: 'संदिग्ध ⚠️', scam: 'धोखाधड़ी 🚨', reportScam: 'रिपोर्ट करें',
  whatToKnow: 'सरकार से क्या जानना चाहते हैं?', generateRTI: 'RTI बनाएं', generating: 'बना रहा है...', department: 'विभाग', filingSteps: 'कैसे दाखिल करें', downloadRTI: 'RTI डाउनलोड',
  selectMaterial: 'सामग्री चुनें', enterPrice: 'बताया गया दाम (₹)', checkPrice: 'दाम जांचें', perBag: 'प्रति बैग', fairPrice: 'सही दाम', overpriced: 'ज़्यादा दाम!',
  cement: 'सीमेंट', steel: 'स्टील', sand: 'रेत', bricks: 'ईंट', paint: 'पेंट', tiles: 'टाइल्स',
  city: 'शहर', area: 'इलाका', loading: 'लोड हो रहा...', error: 'कुछ गलत हुआ', success: 'सफल!', retry: 'पुनः प्रयास', save: 'सेव', share: 'शेयर',
  guideTitle: 'नागरिक साथी का उपयोग कैसे करें', guideStep1: 'कदम 1: ऊपर मेनू से अपनी भाषा चुनें।', guideStep2: 'कदम 2: होम पेज से कोई भी सेवा चुनें।', guideStep3: 'कदम 3: AI से मदद पाने के लिए सरल निर्देशों का पालन करें।', closeGuide: 'समझ गया!',
};

const ta: Translations = { ...en, appName: 'குடிமகன் தோழன்', tagline: 'இந்தியாவின் குடிமகன் தோழன்', welcome: 'வரவேற்கிறோம்!', dashboard: 'முகப்பு', jalGuru: 'ஜல்குரு', scamKavach: 'மோசடி கவசம்', rtiSaathi: 'RTI தோழன்', nirmaanMitra: 'கட்டுமான நண்பன்', signInGoogle: 'Google மூலம் உள்நுழையவும்', signInPhone: 'தொலைபேசி மூலம்', selectLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்', chooseLanguage: 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்' };
const te: Translations = { ...en, appName: 'నాగరిక్ సాథి', tagline: 'భారతదేశ పౌర సహచరుడు', welcome: 'స్వాగతం!', dashboard: 'హోమ్', selectLanguage: 'మీ భాషను ఎంచుకోండి', chooseLanguage: 'మీ ఇష్టమైన భాషను ఎంచుకోండి' };
const bn: Translations = { ...en, appName: 'নাগরিক সাথী', tagline: 'ভারতের নাগরিক সঙ্গী', welcome: 'স্বাগতম!', dashboard: 'হোম', selectLanguage: 'আপনার ভাষা নির্বাচন করুন', chooseLanguage: 'আপনার পছন্দের ভাষা বেছে নিন' };
const mr: Translations = { ...en, appName: 'नागरिक साथी', tagline: 'भारताचा नागरिक साथी', welcome: 'स्वागत!', dashboard: 'होम', selectLanguage: 'तुमची भाषा निवडा', chooseLanguage: 'तुमची आवडती भाषा निवडा' };
const gu: Translations = { ...en, appName: 'નાગરિક સાથી', tagline: 'ભારતનો નાગરિક સાથી', welcome: 'સ્વાગત!', selectLanguage: 'તમારી ભાષા પસંદ કરો', chooseLanguage: 'તમારી પસંદગીની ભાષા પસંદ કરો' };
const kn: Translations = { ...en, appName: 'ನಾಗರಿಕ ಸಾಥಿ', tagline: 'ಭಾರತದ ನಾಗರಿಕ ಸಂಗಾತಿ', welcome: 'ಸ್ವಾಗತ!', selectLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ' };
const ml: Translations = { ...en, appName: 'നാഗരിക് സാഥി', tagline: 'ഇന്ത്യയുടെ പൗര സഹചാരി', welcome: 'സ്വാഗതം!', selectLanguage: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക' };
const pa: Translations = { ...en, appName: 'ਨਾਗਰਿਕ ਸਾਥੀ', tagline: 'ਭਾਰਤ ਦਾ ਨਾਗਰਿਕ ਸਾਥੀ', welcome: 'ਸੁਆਗਤ!', selectLanguage: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ' };
const or_: Translations = { ...en, appName: 'ନାଗରିକ ସାଥୀ', tagline: 'ଭାରତର ନାଗରିକ ସାଥୀ', welcome: 'ସ୍ୱାଗତ!', selectLanguage: 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ' };
const ur: Translations = { ...en, appName: 'شہری ساتھی', tagline: 'ہندوستان کا شہری ساتھی', welcome: '!خوش آمدید', selectLanguage: 'اپنی زبان منتخب کریں' };

export const translations: Record<Language, Translations> = { en, hi, ta, te, bn, mr, gu, kn, ml, pa, or: or_, ur };

export const getTranslation = (lang: Language): Translations => translations[lang] || en;

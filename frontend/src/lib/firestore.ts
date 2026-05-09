import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

// === Water Logs ===
export interface WaterLog {
  id?: string;
  userId: string;
  timestamp: Timestamp;
  area: string;
  city: string;
}

export const addWaterLog = async (userId: string, area: string, city: string) => {
  return addDoc(collection(db, 'waterLogs'), {
    userId, area, city, timestamp: serverTimestamp()
  });
};

export const getWaterLogs = async (city: string, area: string, max = 20) => {
  const q = query(
    collection(db, 'waterLogs'),
    where('city', '==', city),
    where('area', '==', area),
    orderBy('timestamp', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as WaterLog));
};

// === Scam Reports ===
export interface ScamReport {
  id?: string;
  messageText: string;
  scamType: string;
  confidence: number;
  timestamp: Timestamp;
  upvotes: number;
}

export const addScamReport = async (messageText: string, scamType: string, confidence: number) => {
  return addDoc(collection(db, 'scamReports'), {
    messageText, scamType, confidence, upvotes: 0, timestamp: serverTimestamp()
  });
};

export const getRecentScams = async (max = 10) => {
  const q = query(collection(db, 'scamReports'), orderBy('timestamp', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ScamReport));
};

// === Price Reports ===
export interface PriceReport {
  id?: string;
  userId: string;
  material: string;
  brand: string;
  price: number;
  unit: string;
  city: string;
  state: string;
  timestamp: Timestamp;
}

export const addPriceReport = async (data: Omit<PriceReport, 'id' | 'timestamp'>) => {
  return addDoc(collection(db, 'priceReports'), { ...data, timestamp: serverTimestamp() });
};

export const getPriceReports = async (material: string, city: string, max = 30) => {
  const q = query(
    collection(db, 'priceReports'),
    where('material', '==', material),
    where('city', '==', city),
    orderBy('timestamp', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PriceReport));
};

// === RTI Drafts ===
export interface RTIDraft {
  id?: string;
  userId: string;
  query: string;
  department: string;
  generatedText: string;
  status: 'draft' | 'filed' | 'responded';
  createdAt: Timestamp;
}

export const saveRTIDraft = async (data: Omit<RTIDraft, 'id' | 'createdAt'>) => {
  return addDoc(collection(db, 'rtiDrafts'), { ...data, createdAt: serverTimestamp() });
};

export const getUserRTIDrafts = async (userId: string) => {
  const q = query(
    collection(db, 'rtiDrafts'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as RTIDraft));
};

// === User Profile ===
export const saveUserProfile = async (userId: string, data: Record<string, unknown>) => {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
  } catch {
    await addDoc(collection(db, 'users'), { ...data, userId, createdAt: serverTimestamp() });
  }
};

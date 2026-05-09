import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyzeElectricityBill } from '../../lib/gemini';

export const BijliMitra: React.FC = () => {
  const { t, language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Url = e.target?.result as string;
      if (base64Url) {
        setImage(base64Url);
        const mimeType = base64Url.split(';')[0].split(':')[1];
        const base64Data = base64Url.split(',')[1];
        
        try {
          const res = await analyzeElectricityBill(base64Data, mimeType, language === 'hi' ? 'Hindi' : 'English');
          setResult(res);
        } catch (err) {
          console.error(err);
          setResult({ totalAmount: 'Error', slabBreakdown: 'Failed to analyze the image.', anomalyDetected: false, advice: 'Please try again.' });
        }
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <span className="feature-header-icon">⚡</span>
        <h2>{t.bijliMitra}</h2>
      </div>

      <div className="glass-card" style={{ padding: 20 }}>
        <p style={{ marginBottom: 20 }}>Upload a photo of your electricity bill or meter to decode slab rates and detect billing anomalies.</p>
        
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button className="action-btn scam" style={{ flex: 1, padding: 12, fontSize: 16 }} onClick={() => fileInputRef.current?.click()}>
            📷 {t.takePhoto}
          </button>
          <input type="file" ref={fileInputRef} hidden accept="image/*" capture="environment" onChange={handleFileChange} />
        </div>
        
        {image && (
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <img src={image} alt="Electricity Bill" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            <button style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 30, height: 30 }} onClick={() => { setImage(null); setResult(null); }}>✕</button>
          </div>
        )}
      </div>

      {loading && <div className="loading-spinner" style={{ margin: '30px auto' }}></div>}

      {result && !loading && (
        <div className={`result-card ${result.anomalyDetected ? 'danger' : 'safe'} fade-in`}>
          <div className="result-verdict">
            {result.anomalyDetected ? '⚠️ High Bill / Anomaly Detected!' : '✅ Bill Looks Normal'}
          </div>
          
          <div style={{ margin: '16px 0', fontSize: 24, fontWeight: 'bold' }}>
            Total Amount: {result.totalAmount}
          </div>
          
          <div className="result-details">
            <strong>Slab Breakdown:</strong>
            <p>{result.slabBreakdown}</p>
          </div>

          <div className="result-details" style={{ background: 'var(--bg-glass)', padding: 16, borderRadius: 'var(--radius-sm)', marginTop: 16, borderLeft: `4px solid ${result.anomalyDetected ? 'var(--danger)' : 'var(--success)'}` }}>
            <strong>💡 Advice:</strong>
            <p style={{ margin: '8px 0' }}>{result.advice}</p>
          </div>
        </div>
      )}
    </div>
  );
};

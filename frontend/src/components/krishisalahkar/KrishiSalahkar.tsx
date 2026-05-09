import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyzeCropDisease } from '../../lib/gemini';

export const KrishiSalahkar: React.FC = () => {
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
          const res = await analyzeCropDisease(base64Data, mimeType, language === 'hi' ? 'Hindi' : 'English');
          setResult(res);
        } catch (err) {
          console.error(err);
          setResult({ disease: 'Error', severity: 'Unknown', treatment: 'Failed to analyze image. Please try again.', preventiveMeasures: '' });
        }
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <span className="feature-header-icon">🌾</span>
        <h2>{t.krishiSalahkar}</h2>
      </div>

      <div className="glass-card" style={{ padding: 20 }}>
        <p style={{ marginBottom: 20 }}>Upload a photo of a diseased crop leaf to get instant analysis and local treatment recommendations.</p>
        
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button className="action-btn nirmaan" style={{ flex: 1, padding: 12, fontSize: 16 }} onClick={() => fileInputRef.current?.click()}>
            📷 {t.takePhoto}
          </button>
          <input type="file" ref={fileInputRef} hidden accept="image/*" capture="environment" onChange={handleFileChange} />
        </div>
        
        {image && (
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <img src={image} alt="Crop" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            <button style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 30, height: 30 }} onClick={() => { setImage(null); setResult(null); }}>✕</button>
          </div>
        )}
      </div>

      {loading && <div className="loading-spinner" style={{ margin: '30px auto' }}></div>}

      {result && !loading && (
        <div className={`result-card ${result.severity?.toLowerCase() === 'high' ? 'danger' : result.severity?.toLowerCase() === 'medium' ? 'warning' : 'safe'} fade-in`}>
          <div className="result-verdict">
            Analysis Complete (Severity: {result.severity})
          </div>
          
          <div className="result-details" style={{ marginTop: 16 }}>
            <strong>Detected Disease:</strong>
            <p>{result.disease}</p>
          </div>

          <div className="result-details" style={{ background: 'var(--bg-glass)', padding: 16, borderRadius: 'var(--radius-sm)', marginTop: 16, borderLeft: '4px solid var(--primary)' }}>
            <strong>💊 Recommended Treatment:</strong>
            <p style={{ margin: '8px 0' }}>{result.treatment}</p>
          </div>

          <div className="result-details" style={{ marginTop: 16 }}>
            <strong>🛡️ Preventive Measures:</strong>
            <p>{result.preventiveMeasures}</p>
          </div>
        </div>
      )}
    </div>
  );
};

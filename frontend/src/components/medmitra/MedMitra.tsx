import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyzeMedicine } from '../../lib/gemini';

export const MedMitra: React.FC = () => {
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
          const res = await analyzeMedicine(base64Data, mimeType, language === 'hi' ? 'Hindi' : 'English');
          setResult(res);
        } catch (err) {
          console.error(err);
          setResult({ medicineName: 'Error', purpose: 'Failed to analyze the image.', genericAlternative: 'N/A', estimatedSavings: 'N/A' });
        }
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <span className="feature-header-icon">💊</span>
        <h2>{t.medMitra}</h2>
      </div>

      <div className="glass-card" style={{ padding: 20 }}>
        <p style={{ marginBottom: 20 }}>Upload a photo of a medicine strip or bottle to find its purpose and cheaper generic alternatives.</p>
        
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button className="action-btn dastavez" style={{ flex: 1, padding: 12, fontSize: 16 }} onClick={() => fileInputRef.current?.click()}>
            📷 {t.takePhoto}
          </button>
          <input type="file" ref={fileInputRef} hidden accept="image/*" capture="environment" onChange={handleFileChange} />
        </div>
        
        {image && (
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <img src={image} alt="Medicine" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            <button style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 30, height: 30 }} onClick={() => { setImage(null); setResult(null); }}>✕</button>
          </div>
        )}
      </div>

      {loading && <div className="loading-spinner" style={{ margin: '30px auto' }}></div>}

      {result && !loading && (
        <div className="result-card safe fade-in">
          <div className="result-verdict">✅ Analysis Complete</div>
          
          <div className="result-details" style={{ marginTop: 16 }}>
            <strong>Medicine Name:</strong>
            <p>{result.medicineName}</p>
          </div>
          
          <div className="result-details">
            <strong>Purpose:</strong>
            <p>{result.purpose}</p>
          </div>

          <div className="result-details" style={{ background: 'var(--bg-glass)', padding: 16, borderRadius: 'var(--radius-sm)', marginTop: 16, borderLeft: '4px solid var(--success)' }}>
            <strong style={{ color: 'var(--success)' }}>💡 Cheaper Generic Alternative:</strong>
            <p style={{ fontSize: 18, fontWeight: 'bold', margin: '8px 0' }}>{result.genericAlternative}</p>
            <p style={{ color: 'var(--text-secondary)' }}>Estimated Savings: {result.estimatedSavings}</p>
          </div>
        </div>
      )}
    </div>
  );
};

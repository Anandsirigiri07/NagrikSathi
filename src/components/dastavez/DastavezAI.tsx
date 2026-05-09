import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyzeDocument } from '../../lib/gemini';

export const DastavezAI: React.FC = () => {
  const { t, language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Url = e.target?.result as string;
      if (!base64Url) {
        setLoading(false);
        alert(t.error || 'Failed to read image');
        return;
      }
      setImage(base64Url);
      
      const base64Data = base64Url.split(',')[1];
      setLoading(true);
      const res = await analyzeDocument(base64Data, file.type, language === 'hi' ? 'Hindi' : 'English');
      setResult(res);
      setLoading(false);
    };
    reader.onerror = () => {
      setLoading(false);
      alert(t.error || 'Failed to load image');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <span className="feature-header-icon">📜</span>
        <h2>{t.dastavez}</h2>
      </div>

      {!image ? (
        <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} hidden accept="image/*" capture="environment" onChange={handleFileChange} />
          <div className="upload-zone-icon">📷</div>
          <div className="upload-zone-text">{t.uploadDoc}</div>
          <button className="action-btn dastavez" style={{ width: 'auto', padding: '10px 24px', marginTop: 8 }} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
            {t.takePhoto}
          </button>
        </div>
      ) : (
        <div className="fade-in">
          <img src={image} alt="Document" className="preview-img" />
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div className="loading-spinner"></div>
              <p>{t.analyzing}</p>
            </div>
          )}

          {result && !loading && (
            <div className="result-card safe">
              <div className="result-verdict">📝 {result.title}</div>
              <div className="result-details" style={{ marginBottom: 16 }}>{result.summary}</div>
              
              <div className="section-title">{t.actionItems}</div>
              <ul style={{ paddingLeft: 20, marginBottom: 16, color: 'var(--text-secondary)' }}>
                {result.actionItems?.map((item: string, i: number) => <li key={i}>{item}</li>)}
              </ul>

              <div className="section-title">{t.deadlines}</div>
              <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)' }}>
                {result.deadlines?.map((date: string, i: number) => <li key={i}>{date}</li>)}
              </ul>
              
              <div style={{ marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
                {t.department}: {result.department}
              </div>

              <div className="result-actions">
                <button className="action-btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={() => { setImage(null); setResult(null); }}>
                  {t.retry}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

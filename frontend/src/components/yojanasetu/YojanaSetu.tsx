import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { findGovtSchemes } from '../../lib/gemini';

export const YojanaSetu: React.FC = () => {
  const { t, language } = useLanguage();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [income, setIncome] = useState('');
  const [occupation, setOccupation] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!age || !income || !occupation) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await findGovtSchemes(age, gender, income, occupation, language === 'hi' ? 'Hindi' : 'English');
      setResult(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <span className="feature-header-icon">📝</span>
        <h2>{t.yojanaSetu}</h2>
      </div>

      <div className="glass-card" style={{ padding: 20 }}>
        <p style={{ marginBottom: 16, fontSize: 14 }}>Enter your details to find government welfare schemes you qualify for.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <input type="number" className="input-field" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
          <select className="input-field" value={gender} onChange={e => setGender(e.target.value)}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 12 }}>
          <input type="number" className="input-field" placeholder="Annual Family Income (₹)" value={income} onChange={e => setIncome(e.target.value)} />
        </div>

        <div className="input-group" style={{ marginBottom: 20 }}>
          <input type="text" className="input-field" placeholder="Occupation (e.g. Farmer, Student, Weaver)" value={occupation} onChange={e => setOccupation(e.target.value)} />
        </div>

        <button className="action-btn dastavez" onClick={handleSearch} disabled={loading || !age || !income || !occupation}>
          {loading ? t.checking : 'Find Schemes'}
        </button>
      </div>

      {loading && <div className="loading-spinner" style={{ margin: '30px auto' }}></div>}

      {result && !loading && (
        <div className="fade-in" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Top Eligible Schemes</h3>
          {result.schemes.length === 0 && <p>No schemes found based on this profile.</p>}
          
          {result.schemes.map((scheme: any, idx: number) => (
            <div key={idx} className="result-card safe" style={{ marginBottom: 16, background: 'var(--bg-glass)' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>{scheme.name}</div>
              
              <div className="result-details" style={{ marginBottom: 8 }}>
                <strong>Benefits:</strong> {scheme.benefits}
              </div>
              <div className="result-details" style={{ marginBottom: 8 }}>
                <strong>Why you qualify:</strong> {scheme.eligibility}
              </div>
              <div className="result-details" style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
                <strong>How to Apply:</strong> {scheme.howToApply}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

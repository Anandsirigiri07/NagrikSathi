import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyzeTrafficOrConsumerIssue } from '../../lib/gemini';

export const KanoonSaathi: React.FC = () => {
  const { t, language } = useLanguage();
  const [issue, setIssue] = useState('');
  const [type, setType] = useState<'traffic' | 'consumer'>('traffic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    if (!issue) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeTrafficOrConsumerIssue(issue, type, language === 'hi' ? 'Hindi' : 'English');
      setResult(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <span className="feature-header-icon">⚖️</span>
        <h2>{t.kanoonSaathi}</h2>
      </div>

      <div className="glass-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button className={`material-btn ${type === 'traffic' ? 'active' : ''}`} onClick={() => setType('traffic')}>
            🚦 Traffic Stop
          </button>
          <button className={`material-btn ${type === 'consumer' ? 'active' : ''}`} onClick={() => setType('consumer')}>
            🛍️ Consumer Rights
          </button>
        </div>

        <div className="input-group">
          <textarea 
            className="input-field" 
            style={{ height: 120, resize: 'none' }}
            placeholder={type === 'traffic' ? "E.g. I was stopped for not wearing a helmet. The police is asking for ₹5000..." : "E.g. I bought a defective phone and the shopkeeper refuses to refund..."}
            value={issue}
            onChange={e => setIssue(e.target.value)}
          />
        </div>

        <button className="action-btn rti" onClick={handleCheck} disabled={loading || !issue}>
          {loading ? t.checking : 'Get Legal Advice'}
        </button>
      </div>

      {loading && <div className="loading-spinner" style={{ margin: '30px auto' }}></div>}

      {result && !loading && (
        <div className="result-card safe fade-in">
          <div className="result-verdict">⚖️ Expert Advice</div>
          
          <div className="result-details" style={{ marginTop: 16 }}>
            <strong>Actionable Advice:</strong>
            <p>{result.advice}</p>
          </div>
          
          <div className="result-details" style={{ background: 'var(--bg-glass)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
            <strong>{type === 'traffic' ? 'Official Fines/Rules:' : 'Your Basic Rights:'}</strong>
            <p>{result.fineOrRights}</p>
          </div>

          {result.draft && (
            <div className="result-details" style={{ marginTop: 16 }}>
              <strong>{type === 'traffic' ? 'What to say:' : 'Draft Complaint Letter:'}</strong>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 'var(--radius-sm)', fontStyle: 'italic', marginTop: 8, whiteSpace: 'pre-wrap' }}>
                {result.draft}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

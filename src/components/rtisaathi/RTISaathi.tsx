import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { generateRTI } from '../../lib/gemini';
import { saveRTIDraft } from '../../lib/firestore';

export const RTISaathi: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setSaved(false);
    const res = await generateRTI(query, language === 'hi' ? 'Hindi' : 'English');
    setResult(res);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!result || !user || saved) return;
    try {
      await saveRTIDraft({
        userId: user.uid,
        query,
        department: result.department,
        generatedText: result.application,
        status: 'draft'
      });
      setSaved(true);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <span className="feature-header-icon">⚖️</span>
        <h2>{t.rtiSaathi}</h2>
      </div>

      {!result && (
        <div className="glass-card fade-in" style={{ padding: 20 }}>
          <div className="section-title">{t.whatToKnow}</div>
          <div className="input-group">
            <textarea
              className="input-field"
              style={{ minHeight: 120, paddingRight: 16 }}
              placeholder="E.g., Why hasn't the road in front of my house been repaired? Who is the contractor?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="action-btn rti" onClick={handleGenerate} disabled={loading || !query.trim()}>
            {loading ? t.generating : `📝 ${t.generateRTI}`}
          </button>
        </div>
      )}

      {loading && <div className="loading-spinner"></div>}

      {result && !loading && (
        <div className="fade-in">
          <div className="glass-card" style={{ padding: 20, marginBottom: 20, borderLeft: '4px solid var(--rti-primary)' }}>
            <div className="section-title">{t.department}</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{result.department}</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>PIO: {result.pio}</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Fee: {result.fee}</div>
          </div>

          <div className="rti-preview">
            {result.application}
          </div>

          <div className="section-title" style={{ marginTop: 24 }}>{t.filingSteps}</div>
          <div style={{ marginBottom: 24 }}>
            {result.filingSteps?.map((step: string, i: number) => (
              <div key={i} className="rti-step">
                <div className="rti-step-num">{i + 1}</div>
                <div className="rti-step-content">{step}</div>
              </div>
            ))}
          </div>

          <div className="result-actions">
            <button className="action-btn rti" onClick={handleSave} disabled={saved}>
              {saved ? '✅ Saved to Drafts' : t.save}
            </button>
            <button className="action-btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={() => setResult(null)}>
              {t.retry}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

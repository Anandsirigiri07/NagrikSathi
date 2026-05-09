import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { detectScam } from '../../lib/gemini';
import { addScamReport } from '../../lib/firestore';

export const ScamKavach: React.FC = () => {
  const { t, language } = useLanguage();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [reported, setReported] = useState(false);

  const handleCheck = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResult(null);
    setReported(false);
    const res = await detectScam(message, language === 'hi' ? 'Hindi' : 'English');
    setResult(res);
    setLoading(false);
  };

  const handleReport = async () => {
    if (!result || reported) return;
    try {
      await addScamReport(message, result.scamType, result.confidence);
      setReported(true);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <span className="feature-header-icon">🛡️</span>
        <h2>{t.scamKavach}</h2>
      </div>

      <div className="glass-card" style={{ padding: 16, marginBottom: 20 }}>
        <div className="input-group">
          <textarea
            className="input-field"
            style={{ minHeight: 120, paddingRight: 16 }}
            placeholder={t.pasteMessage}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button className="action-btn scam" onClick={handleCheck} disabled={loading || !message.trim()}>
          {loading ? t.checking : `🔍 ${t.checkScam}`}
        </button>
      </div>

      {loading && <div className="loading-spinner"></div>}

      {result && !loading && (
        <div className={`result-card ${result.verdict}`}>
          <div className="result-verdict">
            {result.verdict === 'safe' && t.safe}
            {result.verdict === 'suspicious' && t.suspicious}
            {result.verdict === 'scam' && t.scam}
          </div>
          <div className="result-details" style={{ marginBottom: 12 }}>
            <strong>Confidence:</strong> {result.confidence}%
          </div>
          <div className="result-details" style={{ marginBottom: 12 }}>
            {result.explanation}
          </div>
          <div className="result-details" style={{ padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
            <strong>Advice:</strong> {result.advice}
          </div>

          {(result.verdict === 'scam' || result.verdict === 'suspicious') && (
            <div className="result-actions">
              <button
                className="action-btn"
                style={{ background: reported ? 'var(--success)' : 'var(--danger)' }}
                onClick={handleReport}
                disabled={reported}
              >
                {reported ? '✅ Reported' : `🚨 ${t.reportScam}`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

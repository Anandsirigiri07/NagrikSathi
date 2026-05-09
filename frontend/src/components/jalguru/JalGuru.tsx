import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { addWaterLog, getWaterLogs, type WaterLog } from '../../lib/firestore';
import { predictWaterTiming } from '../../lib/gemini';
import { getCurrentLocation } from '../../lib/geo';

export const JalGuru: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [area, setArea] = useState(localStorage.getItem('ns_area') || '');
  const [city, setCity] = useState(localStorage.getItem('ns_city') || '');
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [prediction, setPrediction] = useState<{prediction:string;confidence:string;pattern:string}|null>(null);
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (city && area) {
      localStorage.setItem('ns_city', city);
      localStorage.setItem('ns_area', area);
      loadLogs();
    }
  }, [city, area]);

  const loadLogs = async () => {
    try {
      const data = await getWaterLogs(city, area);
      setLogs(data);
    } catch { /* offline fallback */ }
  };

  const handleLog = async () => {
    if (!user || !city || !area) return;
    try {
      await addWaterLog(user.uid, area, city);
      setLogged(true);
      setTimeout(() => setLogged(false), 3000);
      loadLogs();
    } catch (e) { console.error(e); }
  };

  const handlePredict = async () => {
    setLoading(true);
    const timestamps = logs.map(l => l.timestamp?.toDate?.()?.toLocaleString?.() || 'unknown');
    const result = await predictWaterTiming(timestamps, area, language === 'hi' ? 'Hindi' : 'English');
    setPrediction(result);
    setLoading(false);
  };

  const handleLocate = async () => {
    setLocating(true);
    const loc = await getCurrentLocation();
    if (loc.city) setCity(loc.city);
    if (loc.area) setArea(loc.area);
    setLocating(false);
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <span className="feature-header-icon">💧</span>
        <h2>{t.jalGuru}</h2>
      </div>

      {(!city || !area) ? (
        <div className="glass-card" style={{ padding: 20 }}>
          <button className="action-btn jal" style={{ marginBottom: 16 }} onClick={handleLocate} disabled={locating}>
            {locating ? 'Locating...' : '📍 Auto-detect Location'}
          </button>
          <div className="input-group" style={{ marginBottom: 12 }}>
            <input className="input-field" placeholder={t.city} value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="input-group">
            <input className="input-field" placeholder={t.area} value={area} onChange={e => setArea(e.target.value)} />
          </div>
        </div>
      ) : (
        <>
          <button className="water-big-btn" onClick={handleLog}>
            {logged ? '✅' : '💧'}
            <span>{logged ? t.success : t.tapWhenWater}</span>
          </button>

          {prediction && (
            <div className="prediction-card fade-in">
              <div className="prediction-label">{t.nextWater}</div>
              <div className="prediction-time">{prediction.prediction}</div>
              <div className="prediction-label" style={{ marginTop: 8 }}>{prediction.pattern}</div>
            </div>
          )}

          <button className="action-btn jal" onClick={handlePredict} disabled={loading} style={{ marginBottom: 20 }}>
            {loading ? '...' : `🤖 ${t.prediction}`}
          </button>

          <div className="section-title">{t.recentLogs}</div>
          <div className="water-timeline">
            {logs.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No logs yet. Tap when water arrives!</p>}
            {logs.slice(0, 10).map((log, i) => (
              <div key={log.id || i} className="water-entry fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <span className="water-entry-time">
                  {log.timestamp?.toDate?.()?.toLocaleTimeString?.([], { hour: '2-digit', minute: '2-digit' }) || '—'}
                </span>
                <span className="water-entry-info">
                  {log.timestamp?.toDate?.()?.toLocaleDateString?.() || ''} · {log.area}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { languageNames, type Language } from '../../lib/translations';

const allLangs: Language[] = ['en','hi','ta','te','bn','mr','gu','kn','ml','pa','or','ur'];

export const LanguagePicker: React.FC = () => {
  const { setLanguage, showPicker } = useLanguage();
  if (!showPicker) return null;
  return (
    <div className="lang-picker-overlay fade-in">
      <div style={{ fontSize: 48, marginBottom: 12 }}>🇮🇳</div>
      <h2 className="lang-picker-title">Select Your Language</h2>
      <p className="lang-picker-subtitle">अपनी भाषा चुनें</p>
      <div className="lang-grid">
        {allLangs.map(l => (
          <button key={l} className="lang-btn" onClick={() => setLanguage(l)}>
            <span className="lang-btn-native">{languageNames[l].native}</span>
            <span className="lang-btn-english">{languageNames[l].english}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

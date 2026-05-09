import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

type Tab = 'dashboard'|'jalguru'|'dastavez'|'scamkavach'|'rtisaathi'|'nirmaanmitra'|'medmitra'|'kanoonsaathi'|'yojanasetu'|'bijlimitra'|'krishisalahkar';

interface Props { onNavigate: (tab: Tab) => void; }

export const Dashboard: React.FC<Props> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const name = user?.displayName?.split(' ')[0] || user?.phoneNumber || '';

  const essentials = [
    { id: 'jalguru', icon: '💧', cls: 'jal', name: t.jalGuru, desc: t.jalDesc, delay: 0 },
    { id: 'bijlimitra', icon: '⚡', cls: 'scam', name: t.bijliMitra, desc: t.bijliDesc, delay: 100 },
    { id: 'yojanasetu', icon: '📝', cls: 'dastavez', name: t.yojanaSetu, desc: t.yojanaDesc, delay: 200 },
  ];

  const legal = [
    { id: 'scamkavach', icon: '🛡️', cls: 'scam', name: t.scamKavach, desc: t.scamDesc, delay: 300 },
    { id: 'kanoonsaathi', icon: '⚖️', cls: 'rti', name: t.kanoonSaathi, desc: t.kanoonDesc, delay: 400 },
    { id: 'rtisaathi', icon: '⚖️', cls: 'rti', name: t.rtiSaathi, desc: t.rtiDesc, delay: 500 },
    { id: 'dastavez', icon: '📜', cls: 'dastavez', name: t.dastavez, desc: t.dastavezDesc, delay: 600 },
  ];

  const specialized = [
    { id: 'nirmaanmitra', icon: '🏗️', cls: 'nirmaan', name: t.nirmaanMitra, desc: t.nirmaanDesc, delay: 700 },
    { id: 'krishisalahkar', icon: '🌾', cls: 'nirmaan', name: t.krishiSalahkar, desc: t.krishiDesc, delay: 800 },
    { id: 'medmitra', icon: '💊', cls: 'jal', name: t.medMitra, desc: t.medDesc, delay: 900 },
  ];

  const renderCarousel = (title: string, items: any[]) => (
    <div className="carousel-section slide-up">
      <div className="carousel-title">{title}</div>
      <div className="carousel-track">
        {items.map(f => (
          <div key={f.id} className={`feature-card ${f.cls} fade-in`} onClick={() => onNavigate(f.id)}
            style={{ animationDelay: `${f.delay}ms` }} tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') onNavigate(f.id); }}>
            <span className="feature-icon">{f.icon}</span>
            <span className="feature-name">{f.name}</span>
            <span className="feature-desc" style={{ fontSize: '11px' }}>{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="feature-page">
      <div className="dashboard-greeting slide-up">
        <h1>{t.welcome} {name && `${name} 👋`}</h1>
        <p>{t.tagline}</p>
      </div>
      
      {renderCarousel('Daily Essentials', essentials)}
      {renderCarousel('Legal & Rights', legal)}
      {renderCarousel('Specialized AI', specialized)}
    </div>
  );
};

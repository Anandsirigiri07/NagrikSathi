import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

type Tab = 'dashboard'|'jalguru'|'dastavez'|'scamkavach'|'rtisaathi'|'nirmaanmitra'|'medmitra'|'kanoonsaathi'|'yojanasetu'|'bijlimitra'|'krishisalahkar';

interface Props { active: Tab; onChange: (tab: Tab) => void; }

export const BottomNav: React.FC<Props> = ({ active, onChange }) => {
  const { t } = useLanguage();

  if (active === 'dashboard') return null;

  return (
    <div style={{ position: 'sticky', bottom: 0, padding: '12px 16px', display: 'flex', justifyContent: 'center', background: 'rgba(10, 14, 26, 0.95)', borderTop: '1px solid var(--border)', zIndex: 100, backdropFilter: 'blur(10px)' }}>
      <button 
        className="action-btn"
        onClick={() => onChange('dashboard')}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--text-primary)',
          fontSize: '18px',
          fontWeight: 'bold',
          width: '100%',
          maxWidth: '400px',
          padding: '14px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
        }}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onChange('dashboard'); }}
      >
        🏠 {t.dashboard}
      </button>
    </div>
  );
};

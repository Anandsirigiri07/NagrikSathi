import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { logOut } from '../../lib/firebase';
import { UserGuideModal } from './UserGuideModal';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showBack, onBack }) => {
  const { t, setShowPicker } = useLanguage();
  const { user } = useAuth();
  const [showGuide, setShowGuide] = useState(false);

  return (
    <header className="header">
      <div className="header-brand">
        {showBack ? (
          <button className="header-btn" onClick={onBack} title="Back" style={{ marginRight: 8 }} tabIndex={0} aria-label="Go Back">
            ⬅️
          </button>
        ) : (
          <span className="header-logo">🇮🇳</span>
        )}
        <div 
          onClick={onBack} 
          style={{ cursor: onBack ? 'pointer' : 'default' }}
          tabIndex={onBack ? 0 : undefined}
          role={onBack ? "button" : undefined}
          onKeyDown={(e) => { if(e.key === 'Enter' && onBack) onBack(); }}
          aria-label={onBack ? "Go to Home Dashboard" : undefined}
        >
          <div className="header-title">{t.appName}</div>
          <div className="header-subtitle">{t.tagline}</div>
        </div>
      </div>
      <div className="header-actions">
        <button className="header-btn" onClick={() => setShowGuide(true)} title="Help" tabIndex={0} aria-label="User Guide">❓</button>
        <button className="header-btn" onClick={() => setShowPicker(true)} title="Language" tabIndex={0} aria-label="Change Language">🌐</button>
        {user?.photoURL ? (
          <img src={user.photoURL} alt="User Avatar" className="user-avatar" onClick={logOut} onKeyDown={(e) => { if(e.key === 'Enter') logOut(); }} title={t.signOut} style={{cursor:'pointer'}} tabIndex={0} role="button" aria-label="Sign Out" />
        ) : user ? (
          <button className="header-btn" onClick={logOut} title={t.signOut} tabIndex={0} aria-label="Sign Out">👤</button>
        ) : null}
      </div>
      {showGuide && <UserGuideModal onClose={() => setShowGuide(false)} />}
    </header>
  );
};

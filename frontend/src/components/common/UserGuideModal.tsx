import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  onClose: () => void;
}

export const UserGuideModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="guide-overlay fade-in">
      <div className="guide-modal slide-up">
        <h2 className="guide-title">{t.guideTitle}</h2>
        
        <div className="guide-steps">
          <div className="guide-step">
            <div className="guide-icon">🌐</div>
            <p>{t.guideStep1}</p>
          </div>
          <div className="guide-step">
            <div className="guide-icon">📱</div>
            <p>{t.guideStep2}</p>
          </div>
          <div className="guide-step">
            <div className="guide-icon">✨</div>
            <p>{t.guideStep3}</p>
          </div>
        </div>

        <button className="action-btn jal guide-btn" onClick={onClose}>
          {t.closeGuide}
        </button>
      </div>
    </div>
  );
};

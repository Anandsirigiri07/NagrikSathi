import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Language, getTranslation, translations } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: ReturnType<typeof getTranslation>;
  showPicker: boolean;
  setShowPicker: (v: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en', setLanguage: () => {}, t: getTranslation('en'), showPicker: false, setShowPicker: () => {}
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [language, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('nagraksathi_lang');
    if (saved && saved in translations) return saved as Language;
    return 'en';
  });

  useEffect(() => {
    const saved = localStorage.getItem('nagraksathi_lang');
    if (!saved || !(saved in translations)) {
      setShowPicker(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLang(lang);
    localStorage.setItem('nagraksathi_lang', lang);
    document.documentElement.lang = lang;
    setShowPicker(false);
  };

  useEffect(() => { document.documentElement.lang = language; }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: getTranslation(language), showPicker, setShowPicker }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LanguagePicker } from './components/common/LanguagePicker';
import { Dashboard } from './components/dashboard/Dashboard';
import { JalGuru } from './components/jalguru/JalGuru';
import { DastavezAI } from './components/dastavez/DastavezAI';
import { ScamKavach } from './components/scamkavach/ScamKavach';
import { RTISaathi } from './components/rtisaathi/RTISaathi';
import { NirmaanMitra } from './components/nirmaanmitra/NirmaanMitra';
import { MedMitra } from './components/medmitra/MedMitra';
import { KanoonSaathi } from './components/kanoonsaathi/KanoonSaathi';
import { YojanaSetu } from './components/yojanasetu/YojanaSetu';
import { BijliMitra } from './components/bijlimitra/BijliMitra';
import { KrishiSalahkar } from './components/krishisalahkar/KrishiSalahkar';

type Tab = 'dashboard'|'jalguru'|'dastavez'|'scamkavach'|'rtisaathi'|'nirmaanmitra'|'medmitra'|'kanoonsaathi'|'yojanasetu'|'bijlimitra'|'krishisalahkar';

function AppContent() {
  console.log('AppContent rendering...');
  const { user, loading } = useAuth();
  console.log('Auth state in App:', { user: user?.uid, loading });
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  if (loading) {
    console.log('App showing loading spinner');
    return <div className="app-container"><div className="loading-spinner"></div></div>;
  }
  if (!user) {
    console.log('App showing AuthScreen');
    return <AuthScreen />;
  }

  return (
    <div className="app-container">
      <Header showBack={activeTab !== 'dashboard'} onBack={() => setActiveTab('dashboard')} />
      <main className="app-content">
        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'jalguru' && <JalGuru />}
        {activeTab === 'dastavez' && <DastavezAI />}
        {activeTab === 'scamkavach' && <ScamKavach />}
        {activeTab === 'rtisaathi' && <RTISaathi />}
        {activeTab === 'nirmaanmitra' && <NirmaanMitra />}
        {activeTab === 'medmitra' && <MedMitra />}
        {activeTab === 'kanoonsaathi' && <KanoonSaathi />}
        {activeTab === 'yojanasetu' && <YojanaSetu />}
        {activeTab === 'bijlimitra' && <BijliMitra />}
        {activeTab === 'krishisalahkar' && <KrishiSalahkar />}
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
      <LanguagePicker />
    </div>
  );
}

export default AppContent;

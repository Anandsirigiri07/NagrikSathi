import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { signInWithGoogle, setupRecaptcha, signInWithPhone } from '../../lib/firebase';
import type { ConfirmationResult } from 'firebase/auth';

export const AuthScreen: React.FC = () => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'main'|'phone'|'otp'>('main');
  const [phone, setPhone] = useState('+91');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult|null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    try { setLoading(true); await signInWithGoogle(); }
    catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true); setError('');
      const verifier = setupRecaptcha('recaptcha-container');
      const result = await signInWithPhone(phone, verifier);
      setConfirmation(result); setMode('otp');
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true); setError('');
      await confirmation?.confirm(otp);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="auth-screen">
      <div className="auth-logo">🇮🇳</div>
      <h1 className="auth-title">{t.appName}</h1>
      <p className="auth-subtitle">{t.tagline}</p>

      {error && <p style={{ color: 'var(--danger)', marginBottom: 16, fontSize: 13 }}>{error}</p>}

      {mode === 'main' && (
        <>
          <button className="auth-btn google" onClick={handleGoogle} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {t.signInGoogle}
          </button>
          <div className="auth-divider">— or —</div>
          <button className="auth-btn phone" onClick={() => setMode('phone')}>📱 {t.signInPhone}</button>
        </>
      )}

      {mode === 'phone' && (
        <>
          <input className="phone-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t.enterPhone} />
          <button className="auth-btn" onClick={handleSendOTP} disabled={loading || phone.length < 13} style={{ marginTop: 16 }}>
            {loading ? '...' : t.sendOTP}
          </button>
        </>
      )}

      {mode === 'otp' && (
        <>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: 14 }}>OTP sent to {phone}</p>
          <div className="otp-input-group">
            {[0,1,2,3,4,5].map(i => (
              <input key={i} className="otp-digit" maxLength={1} type="text" inputMode="numeric"
                value={otp[i] || ''} onChange={e => {
                  const v = otp.split(''); v[i] = e.target.value; setOtp(v.join(''));
                  if (e.target.value && e.target.nextElementSibling) (e.target.nextElementSibling as HTMLInputElement).focus();
                }} />
            ))}
          </div>
          <button className="auth-btn" onClick={handleVerifyOTP} disabled={loading || otp.length < 6} style={{ marginTop: 12 }}>
            {loading ? '...' : t.verifyOTP}
          </button>
        </>
      )}
    </div>
  );
};

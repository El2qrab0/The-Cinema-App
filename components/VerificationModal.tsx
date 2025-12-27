
import React, { useState } from 'react';
import { MONETIZATION_CONFIG, translations } from '../constants';

interface Props {
  language: 'ar' | 'en';
  onVerified: () => void;
}

const VerificationModal: React.FC<Props> = ({ language, onVerified }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const handleUnlock = () => {
    setLoading(true);
    setTimeout(() => {
      // التحقق من الكود المدخل
      if (inputKey.trim().toUpperCase() === MONETIZATION_CONFIG.dailySecret.toUpperCase()) {
        localStorage.setItem('access_expiry', (Date.now() + 86400000).toString());
        onVerified();
      } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
      setLoading(false);
    }, 800);
  };

  const handleGetLink = () => {
    // فتح رابط ShrinkMe في نافذة جديدة
    window.open(MONETIZATION_CONFIG.keyUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-fade-in">
      <div className="bg-zinc-900 w-full max-w-sm rounded-[40px] p-8 border border-white/10 shadow-[0_0_100px_rgba(220,38,38,0.2)] text-center relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-[28px] mx-auto flex items-center justify-center shadow-2xl mb-6 border-2 border-white/10">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          
          <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{t.verifyTitle}</h2>
          <p className="text-[10px] text-zinc-500 font-bold mb-8 leading-relaxed uppercase tracking-widest">{t.verifyDesc}</p>

          <div className="space-y-4">
            <button onClick={handleGetLink} className="w-full py-5 bg-white text-black rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xl">
              {t.getKey}
            </button>

            <div className="relative group">
              <input 
                type="text" 
                placeholder={t.enterKey}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className={`w-full bg-zinc-950 border-2 ${error ? 'border-red-600 animate-shake' : 'border-white/5'} rounded-[20px] px-6 py-5 text-center font-black text-xs uppercase tracking-widest focus:outline-none focus:border-red-600/50 transition-all placeholder-zinc-800`}
              />
              {error && <span className="absolute -bottom-6 left-0 right-0 text-[9px] font-black text-red-500 uppercase tracking-widest">{t.invalidKey}</span>}
            </div>

            <button 
              onClick={handleUnlock} 
              disabled={loading || !inputKey}
              className="w-full py-5 bg-red-600 text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xl shadow-red-900/40 disabled:opacity-30 mt-4"
            >
              {loading ? '...' : t.unlock}
            </button>
          </div>

          <p className="mt-8 text-[8px] text-zinc-600 font-black uppercase tracking-[0.3em]">Licensed to Premium Users Only</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;

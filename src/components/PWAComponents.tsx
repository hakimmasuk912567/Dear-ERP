import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Download,
  RefreshCw,
  Share,
  Smartphone,
  WifiOff,
  X,
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-[95] bg-amber-950 text-amber-100 border border-amber-500/60 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 max-w-sm"
    >
      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
        <WifiOff className="w-4 h-4" />
      </div>
      <div className="text-xs min-w-0">
        <p className="font-extrabold text-amber-200">অফলাইন মোড চালু (Offline Mode)</p>
        <p className="text-[11px] text-amber-300/90 leading-snug">
          কাজ চালিয়ে যান — ইন্টারনেট ফিরলে স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।
        </p>
      </div>
    </div>
  );
};

export const PWAUpdateBanner: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'updating' | 'offline-ready'>('idle');

  useEffect(() => {
    const onUpdating = () => setStatus('updating');
    const onOfflineReady = () => {
      setStatus((prev) => (prev === 'updating' ? prev : 'offline-ready'));
      window.setTimeout(() => {
        setStatus((prev) => (prev === 'offline-ready' ? 'idle' : prev));
      }, 4500);
    };

    window.addEventListener('erp:pwa-updating', onUpdating);
    window.addEventListener('erp:pwa-offline-ready', onOfflineReady);
    return () => {
      window.removeEventListener('erp:pwa-updating', onUpdating);
      window.removeEventListener('erp:pwa-offline-ready', onOfflineReady);
    };
  }, []);

  if (status === 'idle') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 z-[95] rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 border max-w-sm ${
        status === 'updating'
          ? 'bg-slate-950 text-white border-emerald-500/60'
          : 'bg-emerald-950 text-emerald-50 border-emerald-400/50'
      }`}
    >
      {status === 'updating' ? (
        <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      )}
      <div className="text-xs flex-1 min-w-0">
        <p className="font-extrabold">
          {status === 'updating'
            ? 'নতুন আপডেট পাওয়া গেছে — অটো ইনস্টল হচ্ছে...'
            : 'অফলাইন ব্যবহারের জন্য অ্যাপ প্রস্তুত!'}
        </p>
        <p className="text-[11px] opacity-80">
          {status === 'updating'
            ? 'নতুন ফিচার চালু করতে অ্যাপ স্বয়ংক্রিয়ভাবে রিফ্রেশ হবে।'
            : 'নেট ছাড়াও ড্যাশবোর্ড ও আগের ডেটা দেখতে পারবেন।'}
        </p>
      </div>
      {status === 'offline-ready' && (
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="p-1 text-emerald-300 hover:text-white cursor-pointer"
          aria-label="Dismiss offline ready notice"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

interface PWAInstallButtonProps {
  variant?: 'compact' | 'card' | 'dark-pill';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const handleManualUpdateCheck = async () => {
    setCheckingUpdate(true);
    setUpdateMsg('');
    try {
      if (window.__erpCheckForPwaUpdate) {
        const applied = await window.__erpCheckForPwaUpdate();
        setUpdateMsg(
          applied
            ? 'নতুন ভার্সন পাওয়া গেছে — আপডেট হচ্ছে...'
            : 'আপনার অ্যাপটি সর্বশেষ ভার্সনে আপডেট আছে।'
        );
      } else {
        setUpdateMsg('সার্ভিস ওয়ার্কার সক্রিয় রয়েছে (প্রোডাকশন বিল্ডে অটো-আপডেট চলে)।');
      }
    } finally {
      setCheckingUpdate(false);
    }
  };

  if (variant === 'card') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">
                Auto-Updating PWA App (অ্যাপ ইনস্টল ও অটো-আপডেট)
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                ফোন বা কম্পিউটারে অ্যাপ হিসেবে ইনস্টল করুন। ভবিষ্যতে কোনো নতুন মডিউল বা ফিচার আপডেট হলে অ্যাপ স্বয়ংক্রিয়ভাবে (Auto-Update) নতুন ভার্সন নামিয়ে নেবে।
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-xl text-[11px] font-extrabold shrink-0 inline-flex items-center gap-1.5 ${
              isInstalled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                : 'bg-white/10 text-cyan-200 border border-white/15'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isInstalled ? 'App Installed' : 'Auto-Update Ready'}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!isInstalled && isInstallable && (
            <button
              type="button"
              onClick={() => {
                promptInstall();
              }}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Install Dear ERP App</span>
            </button>
          )}

          {!isInstalled && !isInstallable && isIOS && (
            <button
              type="button"
              onClick={() => setShowIOSGuide((v) => !v)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition"
            >
              <Share className="w-4 h-4" />
              <span>How to Install on iPhone / iPad</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleManualUpdateCheck}
            disabled={checkingUpdate}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingUpdate ? 'animate-spin' : ''}`} />
            <span>{checkingUpdate ? 'Checking...' : 'Check for App Updates Now'}</span>
          </button>
        </div>

        {showIOSGuide && (
          <div className="p-3 bg-white/10 border border-white/20 rounded-xl text-xs text-slate-100">
            Safari-তে নিচের <strong>Share (□↑)</strong> বাটনে ট্যাপ করে <strong>&ldquo;Add to Home Screen&rdquo;</strong> সিলেক্ট করুন।
          </div>
        )}

        {updateMsg && (
          <div className="p-2.5 bg-emerald-500/15 border border-emerald-400/30 rounded-xl text-xs text-emerald-200 font-semibold">
            {updateMsg}
          </div>
        )}
      </div>
    );
  }

  if (isInstalled) return null;
  if (!isInstallable && !isIOS) return null;

  const btnClass =
    variant === 'dark-pill'
      ? 'w-full py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer'
      : 'px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shrink-0 whitespace-nowrap';

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isIOS && !isInstallable) {
            setShowIOSGuide(true);
          } else {
            promptInstall();
          }
        }}
        title="Install Dear ERP App"
        className={btnClass}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span className={variant === 'compact' ? 'hidden md:inline' : ''}>
          Install App
        </span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-[98]">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 font-extrabold text-sm">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Install on iPhone / iPad</span>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. Tap the <Share className="w-3.5 h-3.5 inline text-blue-600" /> <strong>Share</strong> icon in Safari.
              <br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.
              <br />
              3. Future software updates install automatically when opened.
            </p>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

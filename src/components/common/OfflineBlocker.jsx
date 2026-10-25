import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * OfflineBlocker Component
 *
 * Enforces the explicit requirement: App must NOT work offline.
 * Blocks application interaction when offline and displays an informative screen
 * with connection retry capability.
 */
export function OfflineBlocker() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsChecking(true);
    try {
      // Test actual connectivity with cache-busting HEAD/GET request
      await fetch('/favicon.svg?t=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
      setIsOffline(false);
    } catch {
      setIsOffline(!navigator.onLine);
    } finally {
      setTimeout(() => setIsChecking(false), 500);
    }
  };

  if (!isOffline) {
    return null;
  }

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="offline-title"
      aria-describedby="offline-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
    >
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center text-slate-100">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <WifiOff className="w-8 h-8" />
        </div>

        <h2 id="offline-title" className="text-xl font-bold tracking-tight text-white mb-2">
          Internet Connection Required
        </h2>

        <p id="offline-desc" className="text-sm text-slate-400 leading-relaxed mb-6">
          axiscaculator requires an active internet connection to ensure accurate electrical rate estimates and prevent stale data. Offline mode is not supported.
        </p>

        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-6 flex items-center justify-center gap-2 text-xs text-amber-300/90 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Please reconnect to Wi-Fi or mobile data</span>
        </div>

        <button
          type="button"
          onClick={handleRetry}
          disabled={isChecking}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-950/30 transition-all cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Checking Connection...' : 'Check Connection Again'}</span>
        </button>

        <p className="text-[11px] text-slate-500 mt-4">
          This screen will automatically close once your connection is restored.
        </p>
      </div>
    </div>
  );
}

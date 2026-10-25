import React, { useState, useEffect } from 'react';
import { Download, Check, Smartphone, X, Share2, PlusSquare, Monitor } from 'lucide-react';

export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Detect iOS devices (Safari on iOS doesn't support beforeinstallprompt)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
    setIsIOS(isAppleDevice);

    const handleBeforeInstall = (e) => {
      // Prevent browser default mini-infobar
      e.preventDefault();
      // Stash the event so it can be triggered on user click
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) {
      return;
    }

    if (deferredPrompt) {
      // Show native installation prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Browser didn't provide native prompt (iOS Safari, Firefox, or already prompted)
      setShowModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
        <Check className="w-4 h-4 text-emerald-400" />
        <span>App Installed</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        aria-label="Install axiscaculator app on your device"
        className="group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        <span>Install App</span>
        <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-white/20 text-emerald-50">
          PWA
        </span>
      </button>

      {/* Manual Install Instructions Modal for iOS & unsupported browsers */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl text-slate-200 relative">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 id="install-modal-title" className="text-lg font-bold text-white mb-2">
              Install axiscaculator
            </h3>

            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Install axiscaculator on your home screen or desktop for rapid, one-tap access to electricity cost calculations.
            </p>

            {isIOS ? (
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 font-bold">1</div>
                  <p className="text-slate-300">
                    Tap the <strong className="text-white">Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1 text-emerald-400" /> at the bottom of Safari.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 font-bold">2</div>
                  <p className="text-slate-300">
                    Scroll down and tap <strong className="text-white">Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 font-bold">3</div>
                  <p className="text-slate-300">
                    Tap <strong className="text-white">Add</strong> in the top right corner to finish.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 font-bold">1</div>
                  <p className="text-slate-300">
                    Look for the <strong className="text-white">Install</strong> icon <Monitor className="w-3.5 h-3.5 inline mx-1 text-emerald-400" /> in your browser address bar (top right).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 font-bold">2</div>
                  <p className="text-slate-300">
                    Or open browser menu <strong className="text-white">(⋮)</strong> and select <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home screen"</strong>.
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

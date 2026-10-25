import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';

// Lazy-loaded routes for optimal initial bundle size and fast LCP/FCP
const ApplianceDirectoryPage = lazy(() =>
  import('./pages/ApplianceDirectoryPage').then((m) => ({ default: m.ApplianceDirectoryPage }))
);
const ApplianceCalculatorPage = lazy(() =>
  import('./pages/ApplianceCalculatorPage').then((m) => ({ default: m.ApplianceCalculatorPage }))
);
const ComparePage = lazy(() =>
  import('./pages/ComparePage').then((m) => ({ default: m.ComparePage }))
);
const HowItWorksPage = lazy(() =>
  import('./pages/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

/**
 * Route loading fallback that preserves height to minimize CLS during transitions
 */
function PageFallback() {
  return (
    <div className="w-full min-h-[50vh] flex items-center justify-center" aria-live="polite">
      <div className="flex items-center gap-2.5 text-emerald-600 text-sm font-medium">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <span className="w-2 h-2 rounded-full bg-emerald-600" />
        <span className="text-slate-500">Loading calculator module...</span>
      </div>
    </div>
  );
}

/**
 * ScrollToTop component ONLY resets scroll position when the route pathname changes,
 * never on button clicks or state updates on the current page.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

/**
 * Redirects legacy /appliances/:slug to /electricity-cost/:slug
 */
function LegacyApplianceRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/electricity-cost/${slug}`} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Core Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/appliance-cost-calculator" element={<ApplianceDirectoryPage />} />
              <Route path="/electricity-cost/:slug" element={<ApplianceCalculatorPage />} />
              <Route path="/compare-electricity-cost" element={<ComparePage />} />
              <Route path="/how-electricity-cost-is-calculated" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Backwards-compatible legacy redirects */}
              <Route path="/appliances" element={<Navigate to="/appliance-cost-calculator" replace />} />
              <Route path="/appliances/:slug" element={<LegacyApplianceRedirect />} />
              <Route path="/compare" element={<Navigate to="/compare-electricity-cost" replace />} />
              <Route path="/how-it-works" element={<Navigate to="/how-electricity-cost-is-calculated" replace />} />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

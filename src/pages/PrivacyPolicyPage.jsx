import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Database, EyeOff } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export function PrivacyPolicyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy — axiscaculator',
    url: 'https://axiscaculator.com/privacy-policy',
  };

  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      <SEOHead
        title="Privacy Policy — Zero Tracking Guarantee | axiscaculator"
        description="Read axiscaculator's privacy policy. We do not collect personal data, require user registration, or send your household configurations to any remote servers."
        canonicalPath="/privacy-policy"
        schema={schema}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy First & Zero Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Privacy <span className="text-emerald-600">Policy</span>
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 2026 • Effective immediately
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-emerald-600" />
            <span>1. Zero Personal Data Collection</span>
          </h2>
          <p>
            axiscaculator is designed from the ground up to respect user anonymity.
            You can use all features of the multi-appliance calculator, dedicated individual calculators,
            and comparison tools completely anonymously without creating an account, logging in, or providing
            an email address, phone number, or home address.
          </p>
        </section>

        {/* Section 2: LocalStorage */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <span>2. How LocalStorage Works</span>
          </h2>
          <p>
            When you configure appliances or save household profiles, this information is stored
            <strong> exclusively in your web browser's LocalStorage API</strong> on your personal device.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 pl-2">
            <li>Your appliance quantities, wattages, and tariffs are never transmitted to any external server or backend database.</li>
            <li>LocalStorage is browser-specific. Configurations saved in Chrome on your laptop will not automatically synchronize with Safari on your smartphone.</li>
            <li>Clearing your browser's site cookies and local storage will reset your saved calculator setup back to default.</li>
          </ul>
        </section>

        {/* Section 3: Third-Party Tracking & Advertising */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>3. Third-Party Scripts & Advertising</span>
          </h2>
          <p>
            We do not inject behavioral trackers, cross-site profiling pixels, or intrusive interstitial ads.
            The core calculator functions offline once cached by your browser, remaining fully operational even
            if external network requests fail.
          </p>
        </section>

        {/* Section 4: Export and Print Rights */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">
            4. Export and Data Ownership
          </h2>
          <p>
            Any reports exported (CSV or JSON) or printed through the platform are generated client-side
            inside your browser memory. You retain 100% ownership over all household configurations you create.
          </p>
        </section>

        {/* Section 5: Contact */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            5. Questions or Privacy Feedback
          </h2>
          <p>
            If you have questions about our privacy architecture or open-source calculation methods,
            please review our <Link to="/about" className="text-emerald-600 underline font-medium">About page</Link> or{' '}
            <Link to="/how-it-works" className="text-emerald-600 underline font-medium">Calculation Methodology</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}

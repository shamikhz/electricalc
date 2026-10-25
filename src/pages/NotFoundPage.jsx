import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Grid, AlertCircle } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export function NotFoundPage() {
  return (
    <div className="py-20 text-center space-y-6 max-w-lg mx-auto">
      <SEOHead
        title="Page Not Found (404) | axiscaculator"
        description="The requested page could not be found. Navigate back to the homepage or explore our 15 appliance electricity calculators."
        canonicalPath="/404"
      />

      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          The link you followed may be broken or the calculator route might have moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
        >
          <Home className="w-4 h-4" /> Go to Homepage
        </Link>
        <Link
          to="/appliance-cost-calculator"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
        >
          <Grid className="w-4 h-4" /> Browse 15 Appliances
        </Link>
      </div>
    </div>
  );
}

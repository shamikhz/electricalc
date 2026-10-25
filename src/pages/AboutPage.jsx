import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export function AboutPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About axiscaculator',
    url: 'https://axiscaculator.com/about',
    description:
      'axiscaculator is an independent educational engineering platform dedicated to energy transparency and electricity cost literacy.',
  };

  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      <SEOHead
        title="About axiscaculator — Mission & Editorial Standards"
        description="Learn about axiscaculator's mission to provide honest, transparent, and accurate home electricity calculators without fabricated data or hidden sponsorships."
        canonicalPath="/about"
        schema={schema}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">About</span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Independent Energy Transparency Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          About axis<span className="text-emerald-600">caculator</span>
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Empowering families and homeowners to understand where their electricity bills come from,
          debunk energy myths, and make informed choices when upgrading appliances.
        </p>
      </div>

      {/* Mission Statement */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          High electricity bills are a common stress in modern households. Yet, online advice is frequently clouded
          by exaggerated marketing claims, fabricated savings percentages, or opaque affiliate rankings.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong>axiscaculator</strong> was built to restore mathematical clarity. We provide simple,
          free, accessible, and mathematically sound energy calculators. Every calculation on our platform
          is visible, unrounded internally, and grounded in standard electrical engineering formulas.
        </p>
      </section>

      {/* Editorial Principles */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Our Core Principles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% User Editable</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never lock wattages or tariffs. Every user can adjust power ratings, quantity, daily hours,
              and electricity rates to match their actual appliances and utility DISCOM.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-World Duty Cycles</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We explicitly explain variable loads: inverter AC compressors that throttle down, refrigerator compressors
              that cycle off 60% of the day, and irons with automatic thermostats.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Tracking & Absolute Privacy</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We do not track your IP, require login, or send your household configurations to any remote server.
              All data stays on your personal device.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No Fabricated Data</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never fabricate energy savings percentages, fake user reviews, or artificial government citations.
              Our values are typical industry benchmarks.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link
          to="/appliance-cost-calculator"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
        >
          Explore All 15 Appliance Calculators <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

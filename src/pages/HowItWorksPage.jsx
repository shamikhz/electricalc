import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export function HowItWorksPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://axiscaculator.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'How Electricity Cost is Calculated',
            item: 'https://axiscaculator.com/how-electricity-cost-is-calculated',
          },
        ],
      },
      {
        '@type': 'Article',
        headline: 'How Household Electricity Cost is Calculated — Units, Watts & Formulas',
        description:
          'A complete guide explaining how watts convert to kilowatt-hours (kWh), what 1 electricity unit means in billing, and the exact formulas used by energy calculators.',
      },
    ],
  };

  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      <SEOHead
        title="How Household Electricity is Calculated — Formulas & Units | axiscaculator"
        description="Learn the physics and mathematics behind electricity billing. Understand watts vs kilowatt-hours (kWh), how 1 electricity unit is defined, and step-by-step cost formulas."
        canonicalPath="/how-electricity-cost-is-calculated"
        schema={schema}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">How It Works</span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Educational Energy Engineering Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          How Electricity Consumption & <span className="text-emerald-600">Costs Are Calculated</span>
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Demystifying electrical power, energy units, and utility tariffs with transparent formulas,
          definitions, and worked practical examples.
        </p>
      </div>

      {/* Section 1: Core Definitions (Watts vs kWh vs Units) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <h2 className="text-2xl font-bold text-slate-900">
          1. Understanding the Core Units: Watts vs. Kilowatt-Hours (kWh)
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          The most frequent confusion in home energy management is confusing <strong>electrical power</strong> with{' '}
          <strong>electrical energy consumption</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Power (Watts / Kilowatts)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Power</strong> is the <em>rate</em> at which an appliance draws electrical electricity at any given instant.
              It is measured in <strong>Watts (W)</strong> or <strong>Kilowatts (1 kW = 1,000 W)</strong>.
              For example, a ceiling fan draws 75 Watts at full speed.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Energy Consumption (Kilowatt-Hours / Units)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Energy</strong> is the <em>cumulative volume</em> of electricity consumed over time.
              It is measured in <strong>Kilowatt-hours (kWh)</strong>. In standard electricity billing across India and most of the world,{' '}
              <strong className="text-emerald-700">1 kWh = Exactly 1 Electricity Unit</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: The Exact Mathematical Formulas */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          2. The Exact Formulas Used in axiscaculator
        </h2>

        <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Formula A: Daily Energy Consumption (kWh)
            </h3>
            <div className="bg-slate-900 text-emerald-400 font-mono text-sm p-3 rounded-lg">
              Daily Energy (kWh) = [Power (Watts) × Quantity × Operating Hours/Day] ÷ 1,000
            </div>
            <p className="text-xs text-slate-600">
              Dividing by 1,000 converts Watt-hours into Kilowatt-hours (kWh).
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Formula B: Period Energy Consumption (Monthly or Yearly)
            </h3>
            <div className="bg-slate-900 text-emerald-400 font-mono text-sm p-3 rounded-lg">
              Period Energy (kWh) = Daily Energy (kWh) × Number of Days
            </div>
            <p className="text-xs text-slate-600">
              For monthly estimates, our calculator supports 28, 30, or 31 days. Yearly projections use 365 days.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Formula C: Estimated Electricity Cost (₹)
            </h3>
            <div className="bg-slate-900 text-emerald-400 font-mono text-sm p-3 rounded-lg">
              Period Cost (₹) = Period Energy (kWh) × Electricity Tariff (₹ / kWh)
            </div>
            <p className="text-xs text-slate-600">
              Total household cost is computed by summing the period cost across every active appliance.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Understanding Real Electricity Utility Bills */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          3. What Is Included vs. Excluded in Base Calculators
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          To maintain transparency and trust, axiscaculator clearly discloses what basic energy calculators compute:
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-800">
              <strong>What is Calculated:</strong> Direct variable energy charges corresponding to the electricity
              drawn by your appliances (<code className="bg-white px-1 py-0.5 rounded text-emerald-700 font-bold">kWh × ₹/unit</code>).
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50/70 p-4 rounded-xl border border-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-800 space-y-1">
              <strong>What Actual DISCOM Bills Also Contain:</strong>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pt-1">
                <li><strong>Fixed Charges:</strong> Monthly meter rental and sanctioned load capacity fee (e.g. ₹50–₹150 per kW of connected load).</li>
                <li><strong>Telescopic Slab Tariffs:</strong> Many states charge ₹4/unit for the first 100 units, ₹7/unit for 101–300 units, and ₹10/unit above 300 units.</li>
                <li><strong>Fuel Surcharge (FAC / FPPCA):</strong> Variable monthly adjustments based on coal and gas fuel procurement prices.</li>
                <li><strong>Electricity Duty & Taxes:</strong> State government levy (typically 5% to 15% of the bill).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA to Calculator */}
      <div className="text-center pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
        >
          Try the Multi-Appliance Calculator Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

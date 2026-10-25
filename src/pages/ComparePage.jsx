import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GitCompare,
  TrendingDown,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { calculateComparison } from '../utils/calculations';
import { formatCurrency, formatEnergy, formatPercent } from '../utils/formatting';
import { validateWatts, validateQuantity, validateHours, validateRate } from '../utils/validation';

const COMMON_COMPARISONS = [
  {
    name: 'BLDC Fan vs Regular Fan',
    description: 'Compare 75W standard induction fan with 28W BLDC motor',
    appA: { name: 'Standard 75W Induction Fan', watts: 75, quantity: 2, hours: 12 },
    appB: { name: 'Energy-Saving 28W BLDC Fan', watts: 28, quantity: 2, hours: 12 },
    priceDiff: 2400, // Extra upfront cost for 2 BLDC fans
  },
  {
    name: '5-Star Inverter AC vs 3-Star Fixed AC',
    description: 'Compare 1.5 Ton 3-Star non-inverter AC with 5-Star inverter',
    appA: { name: '1.5 Ton 3-Star Non-Inverter AC', watts: 1650, quantity: 1, hours: 8 },
    appB: { name: '1.5 Ton 5-Star Inverter AC', watts: 1150, quantity: 1, hours: 8 },
    priceDiff: 7500, // Price difference
  },
  {
    name: '9W LED Bulb vs 60W Incandescent',
    description: 'Compare old incandescent lighting with modern LED bulbs',
    appA: { name: 'Old 60W Incandescent Bulbs', watts: 60, quantity: 6, hours: 6 },
    appB: { name: 'Modern 9W LED Bulbs', watts: 9, quantity: 6, hours: 6 },
    priceDiff: 450,
  },
  {
    name: 'Inverter Refrigerator vs Older Fridge',
    description: 'Compare older double door fridge with 5-star inverter fridge',
    appA: { name: 'Old Double Door Fridge (3-Star)', watts: 240, quantity: 1, hours: 10 },
    appB: { name: '5-Star Inverter Frost-Free', watts: 140, quantity: 1, hours: 10 },
    priceDiff: 5000,
  },
];

export function ComparePage() {
  // Baseline Appliance A
  const [nameA, setNameA] = useState('Standard Appliance A');
  const [wattsA, setWattsA] = useState(75);
  const [qtyA, setQtyA] = useState(2);
  const [hoursA, setHoursA] = useState(12);

  // Proposed Efficient Appliance B
  const [nameB, setNameB] = useState('Energy-Efficient Appliance B');
  const [wattsB, setWattsB] = useState(28);
  const [qtyB, setQtyB] = useState(2);
  const [hoursB, setHoursB] = useState(12);

  // Settings
  const [electricityRate, setElectricityRate] = useState(7);
  const [priceDifference, setPriceDifference] = useState(2400);

  // Validations
  const vWattsA = validateWatts(wattsA);
  const vQtyA = validateQuantity(qtyA);
  const vHoursA = validateHours(hoursA);

  const vWattsB = validateWatts(wattsB);
  const vQtyB = validateQuantity(qtyB);
  const vHoursB = validateHours(hoursB);

  const vRate = validateRate(electricityRate);

  const hasErrors =
    !vWattsA.isValid ||
    !vQtyA.isValid ||
    !vHoursA.isValid ||
    !vWattsB.isValid ||
    !vQtyB.isValid ||
    !vHoursB.isValid ||
    !vRate.isValid;

  // Calculate Comparison using central engine
  const comparison = calculateComparison(
    { watts: wattsA, quantity: qtyA, hoursPerDay: hoursA },
    { watts: wattsB, quantity: qtyB, hoursPerDay: hoursB },
    {
      electricityRate: Number(electricityRate) || 0,
      daysInMonth: 30,
      daysInYear: 365,
      priceDifference: Number(priceDifference) || 0,
    }
  );

  // Load a quick comparison preset
  const handleLoadPreset = (preset) => {
    setNameA(preset.appA.name);
    setWattsA(preset.appA.watts);
    setQtyA(preset.appA.quantity);
    setHoursA(preset.appA.hours);

    setNameB(preset.appB.name);
    setWattsB(preset.appB.watts);
    setQtyB(preset.appB.quantity);
    setHoursB(preset.appB.hours);

    setPriceDifference(preset.priceDiff);
  };

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
            name: 'Compare Electricity Cost',
            item: 'https://axiscaculator.com/compare-electricity-cost',
          },
        ],
      },
      {
        '@type': 'WebApplication',
        name: 'Appliance Energy Comparison and Payback Calculator',
        url: 'https://axiscaculator.com/compare-electricity-cost',
        description:
          'Compare energy consumption between two appliances and calculate annual electricity bill savings and payback period.',
      },
    ],
  };

  return (
    <div className="space-y-10 pb-16">
      <SEOHead
        title="Appliance Comparison & Energy Savings Calculator | axiscaculator"
        description="Compare two appliances (e.g. BLDC vs regular fan, 5-star vs 3-star AC) to calculate exact electricity bill savings, kWh reduction, and investment payback period."
        canonicalPath="/compare-electricity-cost"
        schema={schema}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">Compare & Save</span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Payback Period & Energy Reduction Analyzer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Appliance Comparison & <span className="text-emerald-600">Savings Calculator</span>
        </h1>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          Wondering whether upgrading to a 5-star or BLDC appliance is worth the higher upfront price?
          Compare two appliances side-by-side to find out your exact monthly savings and breakeven payback timeline.
        </p>
      </div>

      {/* Quick Comparison Presets */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          ⚡ Popular Comparison Scenarios:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COMMON_COMPARISONS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleLoadPreset(p)}
              className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/30 transition-all text-xs space-y-1 shadow-2xs group"
            >
              <div className="font-bold text-slate-800 group-hover:text-emerald-700">
                {p.name}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                {p.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Warning Alert */}
      {hasErrors && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Please check your inputs: power must be &gt; 0W, quantity must be a whole number (≥ 1), hours between 0–24, and tariff rate ≥ ₹0.</span>
        </div>
      )}

      {/* Side-by-Side Appliance Comparison Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Option A: Baseline / Conventional */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
                A
              </span>
              <h2 className="font-bold text-slate-900 text-base">Baseline Appliance</h2>
            </div>
            <span className="text-xs text-slate-400">Current or Standard Model</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Description / Label
              </label>
              <input
                type="text"
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                  Power (Watts)
                </label>
                <input
                  type="number"
                  min="1"
                  value={wattsA}
                  onChange={(e) => setWattsA(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={qtyA}
                  onChange={(e) => setQtyA(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                  Hours/Day
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={hoursA}
                  onChange={(e) => setHoursA(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold"
                />
              </div>
            </div>

            {/* Sub-results A */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block">Monthly Units:</span>
                <span className="font-bold text-slate-800 text-sm">
                  {formatEnergy(comparison.baselineStats.monthlyKwh)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Monthly Bill:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatCurrency(comparison.baselineStats.monthlyCost)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Option B: Proposed / Energy-Efficient */}
        <div className="bg-white rounded-2xl border-2 border-emerald-500/80 p-6 space-y-4 shadow-sm relative">
          <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
            Energy Saver Option
          </span>

          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                B
              </span>
              <h2 className="font-bold text-slate-900 text-base">Proposed Alternative</h2>
            </div>
            <span className="text-xs text-emerald-600 font-semibold">High Efficiency</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Description / Label
              </label>
              <input
                type="text"
                value={nameB}
                onChange={(e) => setNameB(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                  Power (Watts)
                </label>
                <input
                  type="number"
                  min="1"
                  value={wattsB}
                  onChange={(e) => setWattsB(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/20 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={qtyB}
                  onChange={(e) => setQtyB(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                  Hours/Day
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={hoursB}
                  onChange={(e) => setHoursB(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold"
                />
              </div>
            </div>

            {/* Sub-results B */}
            <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-emerald-800 block">Monthly Units:</span>
                <span className="font-bold text-emerald-900 text-sm">
                  {formatEnergy(comparison.efficientStats.monthlyKwh)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-emerald-800 block">Monthly Bill:</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {formatCurrency(comparison.efficientStats.monthlyCost)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tariff & Purchase Price Difference Controls */}
      <div className="bg-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Electricity Tariff (₹ / kWh)
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-sm text-slate-400 font-bold">₹</span>
            <input
              type="number"
              min="0"
              step="0.25"
              value={electricityRate}
              onChange={(e) => setElectricityRate(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Upfront Price Difference / Additional Cost for Appliance B (₹)
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-sm text-slate-400 font-bold">₹</span>
            <input
              type="number"
              min="0"
              step="100"
              value={priceDifference}
              onChange={(e) => setPriceDifference(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold bg-white"
              placeholder="e.g. 2000"
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Used to calculate investment breakeven payback period.
          </span>
        </div>
      </div>

      {/* Savings & Payback Results Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <TrendingDown className="w-5 h-5" />
          <span>Calculated Savings & Payback Analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Savings */}
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Monthly Bill Savings</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tabular-nums">
              {comparison.savedMonthlyCost > 0
                ? formatCurrency(comparison.savedMonthlyCost)
                : '₹0.00'}
            </div>
            <p className="text-xs text-slate-400 tabular-nums">
              Saves {formatEnergy(comparison.savedMonthlyKwh)} (Units) each month
            </p>
          </div>

          {/* Annual Savings */}
          <div className="space-y-1 md:border-l md:border-slate-800 md:pl-6">
            <span className="text-xs text-slate-400 font-semibold block">Annual Bill Savings</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
              {comparison.savedYearlyCost > 0
                ? formatCurrency(comparison.savedYearlyCost)
                : '₹0.00'}
            </div>
            <p className="text-xs text-slate-400 tabular-nums">
              {formatPercent(comparison.percentageEnergySaved)} power reduction vs Appliance A
            </p>
          </div>

          {/* Payback Period */}
          <div className="space-y-1 md:border-l md:border-slate-800 md:pl-6">
            <span className="text-xs text-slate-400 font-semibold block">Investment Payback</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-300 tabular-nums">
              {comparison.paybackMonths
                ? `${comparison.paybackMonths.toFixed(1)} Months`
                : priceDifference <= 0
                ? 'Immediate'
                : 'N/A'}
            </div>
            <p className="text-xs text-slate-400 tabular-nums">
              {comparison.paybackYears && comparison.paybackYears >= 1
                ? `Approx. ${comparison.paybackYears.toFixed(1)} years to break even`
                : 'Time required to recover upfront price premium'}
            </p>
          </div>
        </div>

        {/* Payback Explanation Text */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 text-xs text-slate-300 space-y-2">
          <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Economic Insight:</span>
          </div>
          <p className="leading-relaxed">
            By choosing <strong>{nameB}</strong> instead of <strong>{nameA}</strong>, you reduce your daily consumption by{' '}
            <strong>{formatEnergy(comparison.savedDailyKwh)}</strong>. Over a 5-year operating lifespan, total cumulative electricity savings will reach{' '}
            <strong className="text-emerald-400">
              {formatCurrency(comparison.savedYearlyCost * 5)}
            </strong>, returning your initial extra investment of {formatCurrency(priceDifference)} multiple times over.
          </p>
        </div>
      </div>
    </div>
  );
}

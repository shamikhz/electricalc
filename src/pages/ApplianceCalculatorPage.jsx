import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Info,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { ApplianceIcon } from '../components/common/ApplianceIcon';
import { SEOHead } from '../components/common/SEOHead';
import { getApplianceBySlug, APPLIANCES } from '../data/appliances';
import { calculateApplianceStats } from '../utils/calculations';
import { formatCurrency, formatEnergy, formatPower } from '../utils/formatting';
import { validateWatts, validateQuantity, validateHours, validateRate } from '../utils/validation';
import { getCurrentHouseholdConfig, saveCurrentHouseholdConfig } from '../utils/storage';

export function ApplianceCalculatorPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const appliance = getApplianceBySlug(slug);

  // Calculator State initialized with appliance's representative defaults (or fallbacks)
  const [watts, setWatts] = useState(appliance?.defaultWatts ?? 100);
  const [quantity, setQuantity] = useState(1);
  const [hoursPerDay, setHoursPerDay] = useState(appliance?.defaultHours ?? 1);
  const [electricityRate, setElectricityRate] = useState(7);
  const [daysInMonth, setDaysInMonth] = useState(30);
  const [daysInYear] = useState(365);
  const [period, setPeriod] = useState('monthly'); // 'daily', 'monthly', 'yearly'
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Reset inputs when slug or appliance changes
  useEffect(() => {
    if (appliance) {
      setWatts(appliance.defaultWatts);
      setHoursPerDay(appliance.defaultHours);
      setQuantity(1);
      setTransferSuccess(false);
    }
  }, [slug, appliance]);

  // If slug is invalid, render 404 message
  if (!appliance) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Appliance Not Found</h1>
        <p className="text-slate-600 text-sm">
          The requested appliance calculator does not exist in our directory.
        </p>
        <Link
          to="/appliance-cost-calculator"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>
    );
  }

  // Validations
  const wattsValidation = validateWatts(watts);
  const qtyValidation = validateQuantity(quantity);
  const hoursValidation = validateHours(hoursPerDay);
  const rateValidation = validateRate(electricityRate);
  const hasErrors =
    !wattsValidation.isValid ||
    !qtyValidation.isValid ||
    !hoursValidation.isValid ||
    !rateValidation.isValid;

  // Run central calculation engine
  const stats = calculateApplianceStats({
    watts: Number(watts) || 0,
    quantity: Number(quantity) || 1,
    hoursPerDay: Number(hoursPerDay) || 0,
    electricityRate: Number(electricityRate) || 0,
    daysInMonth,
    daysInYear,
  });

  // Active period figures
  let activeKwh = stats.monthlyKwh;
  let activeCost = stats.monthlyCost;

  if (period === 'daily') {
    activeKwh = stats.dailyKwh;
    activeCost = stats.dailyCost;
  } else if (period === 'yearly') {
    activeKwh = stats.yearlyKwh;
    activeCost = stats.yearlyCost;
  }

  // Transfer to Main Household Calculator Handler
  const handleTransferToHousehold = () => {
    const current = getCurrentHouseholdConfig();
    const newEntry = {
      id: `app-transferred-${Date.now()}`,
      applianceSlug: appliance.slug,
      customName: `${appliance.name} (${watts}W)`,
      watts: Number(watts) || appliance.defaultWatts,
      quantity: Number(quantity) || 1,
      hoursPerDay: Number(hoursPerDay) || appliance.defaultHours,
      isEnabled: true,
    };

    const updatedAppliances = [newEntry, ...current.appliances];
    saveCurrentHouseholdConfig(updatedAppliances, current.settings);

    setTransferSuccess(true);
    setTimeout(() => {
      navigate(`/?transferred=${appliance.slug}`);
    }, 800);
  };

  // Structured Data (Breadcrumbs + FAQ Schema)
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
            name: 'Appliance Directory',
            item: 'https://axiscaculator.com/appliance-cost-calculator',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: appliance.name,
            item: `https://axiscaculator.com/electricity-cost/${appliance.slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: appliance.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="space-y-10 pb-16">
      <SEOHead
        title={`${appliance.name} Power Consumption & Cost Calculator | axiscaculator`}
        description={`Calculate electricity units (kWh) and monthly running cost for ${appliance.name.toLowerCase()}s. Includes typical wattages, duty cycle caveats, and worked examples.`}
        canonicalPath={`/electricity-cost/${appliance.slug}`}
        schema={schema}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/appliance-cost-calculator" className="hover:text-emerald-600 transition-colors">Appliance Directory</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{appliance.name}</span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <ApplianceIcon name={appliance.iconName} className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {appliance.name} Electricity <span className="text-emerald-600">Cost Calculator</span>
            </h1>
            <p className="text-xs text-slate-500">
              Category: {appliance.category} • Example power range: {appliance.typicalWattageRange.label}
            </p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {appliance.overview}
        </p>
      </div>

      {/* Calculator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Interactive Inputs Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <span>Customize Calculator Inputs</span>
            </h2>
            <span className="text-xs text-slate-400">All fields editable</span>
          </div>

          {/* Quick Presets Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Select Capacity / Star-Rating Preset:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {appliance.presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setWatts(preset.watts)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    watts === preset.watts
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <div className="truncate">{preset.label}</div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    {preset.watts} Watts
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Power Rating (Watts) */}
            <div>
              <label htmlFor="custom-watts" className="block text-xs font-semibold text-slate-700 mb-1">
                Power (Watts)
              </label>
              <div className="relative">
                <input
                  id="custom-watts"
                  type="number"
                  min="1"
                  step="1"
                  value={watts}
                  onChange={(e) => setWatts(e.target.value === '' ? '' : Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 ${
                    !wattsValidation.isValid
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-emerald-500'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                  W
                </span>
              </div>
              {!wattsValidation.isValid && (
                <span className="text-[11px] text-rose-600 block mt-1 font-medium">
                  {wattsValidation.error}
                </span>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="custom-qty" className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity (Units)
              </label>
              <input
                id="custom-qty"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 ${
                  !qtyValidation.isValid
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-300 focus:ring-emerald-500'
                }`}
              />
              {!qtyValidation.isValid && (
                <span className="text-[11px] text-rose-600 block mt-1 font-medium">
                  {qtyValidation.error}
                </span>
              )}
            </div>

            {/* Operating Hours / Day */}
            <div>
              <label htmlFor="custom-hours" className="block text-xs font-semibold text-slate-700 mb-1">
                Usage (Hours / Day)
              </label>
              <div className="relative">
                <input
                  id="custom-hours"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value === '' ? '' : Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 ${
                    !hoursValidation.isValid
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-emerald-500'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                  hrs
                </span>
              </div>
              {!hoursValidation.isValid && (
                <span className="text-[11px] text-rose-600 block mt-1 font-medium">
                  {hoursValidation.error}
                </span>
              )}
            </div>
          </div>

          {/* Electricity Tariff (₹/kWh) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="tariff-rate" className="text-xs font-semibold text-slate-700">
                Electricity Tariff Rate (₹ / kWh or Unit)
              </label>
              <span className="text-[11px] text-slate-400">National avg ~ ₹7.00</span>
            </div>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-2 text-sm text-slate-500 font-bold">₹</span>
              <input
                id="tariff-rate"
                type="number"
                min="0"
                step="0.25"
                value={electricityRate}
                onChange={(e) => setElectricityRate(e.target.value === '' ? '' : Number(e.target.value))}
                className={`w-full pl-7 pr-16 py-2 rounded-lg border text-sm font-bold bg-white focus:outline-none focus:ring-2 ${
                  !rateValidation.isValid
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-300 focus:ring-emerald-500'
                }`}
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">
                / Unit
              </span>
            </div>
            {!rateValidation.isValid && (
              <span className="text-[11px] text-rose-600 block font-medium">
                {rateValidation.error}
              </span>
            )}
          </div>

          {/* Action: Transfer to Main Household Calculator */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTransferToHousehold}
              disabled={hasErrors}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {transferSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Transferred! Opening Household Calculator...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Add this {appliance.name} to Household Calculator</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Transfers these exact wattage and hours into your multi-appliance household list.
            </p>
          </div>
        </div>

        {/* Right Col: Instant Results Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
          {/* Period Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Billing Period
              </span>
              {period === 'monthly' && (
                <div className="flex items-center gap-1 text-[11px] bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400">Days:</span>
                  {[28, 30, 31].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysInMonth(d)}
                      className={`px-1.5 py-0.5 rounded ${
                        daysInMonth === d ? 'bg-emerald-500 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-xl text-xs font-semibold text-center">
              <button
                type="button"
                onClick={() => setPeriod('daily')}
                className={`py-1.5 rounded-lg transition-colors ${
                  period === 'daily' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setPeriod('monthly')}
                className={`py-1.5 rounded-lg transition-colors ${
                  period === 'monthly' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly ({daysInMonth}d)
              </button>
              <button
                type="button"
                onClick={() => setPeriod('yearly')}
                className={`py-1.5 rounded-lg transition-colors ${
                  period === 'yearly' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Yearly ({daysInYear}d)
              </button>
            </div>
          </div>

          {/* Primary Cost Figure */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Estimated {period.toUpperCase()} Cost
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white tabular-nums">
              {!hasErrors ? formatCurrency(activeCost) : '₹0.00'}
            </div>
            <p className="text-xs text-slate-400">
              For {quantity} unit{quantity > 1 ? 's' : ''} running {hoursPerDay} hrs/day at ₹{electricityRate}/unit
            </p>
          </div>

          {/* Energy Figure */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
              Electricity Consumption
            </span>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-teal-100 tabular-nums">
              {!hasErrors ? formatEnergy(activeKwh) : '0.00 kWh'}
            </div>
            <p className="text-xs text-slate-400">
              Adds <strong className="text-slate-200">{formatEnergy(activeKwh, { showUnitLabel: false })} Units</strong> to your {period} utility meter reading
            </p>
          </div>

          {/* All Periods Quick Comparison Table */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 space-y-2.5 text-xs">
            <span className="font-bold text-slate-300 block">
              Quick Multi-Duration Summary:
            </span>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span>1 Day (24 hrs window):</span>
                <span className="font-bold text-white tabular-nums">{formatCurrency(stats.dailyCost)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>1 Month ({daysInMonth} days):</span>
                <span className="font-bold text-white tabular-nums">{formatCurrency(stats.monthlyCost)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>1 Year (365 days):</span>
                <span className="font-bold text-white tabular-nums">{formatCurrency(stats.yearlyCost)}</span>
              </div>
            </div>
          </div>

          {/* Compare Button */}
          <Link
            to={`/compare?primary=${appliance.slug}`}
            className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <span>Compare with energy-saving alternative</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>
      </div>

      {/* Duty Cycle Note (Section 4 Rule 9 & Section 6 Rule 4) */}
      <section className="bg-amber-50 rounded-2xl border border-amber-200 p-6 sm:p-7 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Understanding Real-World Duty Cycles & Power Limitations</span>
        </div>
        <p className="text-sm text-amber-950 leading-relaxed">
          {appliance.dutyCycleNote}
        </p>
      </section>

      {/* Worked Example (Section 10 GEO & Section 11 AEO) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Step-by-Step Calculation Walkthrough
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            {appliance.workedExample.headline}
          </h2>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3 font-mono text-xs sm:text-sm text-slate-800">
          {appliance.workedExample.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">Step {idx + 1}:</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Typical Power Consumption Table */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 content-visibility-auto">
        <h2 className="text-xl font-bold text-slate-900">
          Typical {appliance.name} Models & Monthly Running Costs (at ₹7/kWh, 30 Days)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                <th className="py-3 px-4">Model / Specification</th>
                <th className="py-3 px-4">Power (Watts)</th>
                <th className="py-3 px-4">Usage (hrs/day)</th>
                <th className="py-3 px-4">Monthly Units (kWh)</th>
                <th className="py-3 px-4">Monthly Cost (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appliance.typicalTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">{row.model}</td>
                  <td className="py-3 px-4 text-slate-600">{formatPower(row.watts)}</td>
                  <td className="py-3 px-4 text-slate-600">{row.dailyHours} hrs</td>
                  <td className="py-3 px-4 text-slate-600 font-semibold tabular-nums">{row.monthlyKwh.toFixed(1)} kWh</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold tabular-nums">{formatCurrency(row.monthlyCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Energy Saving Tips */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 content-visibility-auto">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900">
            Actionable Energy Saving Tips for {appliance.name}s
          </h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
          {appliance.energySavingTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQs Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 content-visibility-auto">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs text-slate-500">
            Factual answers regarding {appliance.name.toLowerCase()} electrical consumption and billing.
          </p>
        </div>

        <div className="space-y-4">
          {appliance.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {faq.q}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Appliances Links */}
      <section className="pt-6 border-t border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Other Popular Appliance Calculators
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {APPLIANCES.filter((a) => a.slug !== appliance.slug)
            .slice(0, 4)
            .map((rel) => (
              <Link
                key={rel.slug}
                to={`/electricity-cost/${rel.slug}`}
                className="p-3 bg-white hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-300 text-center transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-700 mx-auto flex items-center justify-center mb-2">
                  <ApplianceIcon name={rel.iconName} className="w-4 h-4" />
                </div>
                <div className="font-semibold text-xs text-slate-800 group-hover:text-emerald-800 truncate">
                  {rel.name}
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

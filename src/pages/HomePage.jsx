import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  FolderOpen,
  Share2,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { ApplianceRow } from '../components/calculator/ApplianceRow';
import { TotalsCard } from '../components/calculator/TotalsCard';
import { HouseholdManagerModal } from '../components/calculator/HouseholdManagerModal';
import { ExportShareModal } from '../components/calculator/ExportShareModal';
import { AddApplianceModal } from '../components/calculator/AddApplianceModal';
import { SEOHead } from '../components/common/SEOHead';
import { getApplianceBySlug } from '../data/appliances';
import { calculateHouseholdTotals } from '../utils/calculations';
import {
  getCurrentHouseholdConfig,
  saveCurrentHouseholdConfig,
} from '../utils/storage';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appliances, setAppliances] = useState(() => getCurrentHouseholdConfig().appliances);
  const [settings, setSettings] = useState(() => getCurrentHouseholdConfig().settings);

  const [period, setPeriod] = useState('monthly'); // 'daily', 'monthly', 'yearly'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Handle transfer query params if navigated from an individual appliance page
  useEffect(() => {
    const transferredSlug = searchParams.get('transferred');
    if (transferredSlug) {
      const meta = getApplianceBySlug(transferredSlug);
      if (meta) {
        setNotification(`Added "${meta.name}" to your household calculator.`);
        setTimeout(() => setNotification(''), 4000);
      }
      searchParams.delete('transferred');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // 2. Persist to LocalStorage whenever appliances or settings change
  useEffect(() => {
    if (appliances.length > 0) {
      saveCurrentHouseholdConfig(appliances, settings);
    }
  }, [appliances, settings]);

  // Handle setting updates
  const setElectricityRate = (rate) => {
    setSettings((prev) => ({ ...prev, electricityRate: rate }));
  };

  const setDaysInMonth = (days) => {
    setSettings((prev) => ({ ...prev, daysInMonth: days }));
  };

  // Determine active period days
  const periodDays =
    period === 'daily' ? 1 : period === 'yearly' ? settings.daysInYear : settings.daysInMonth;

  // Run central calculation engine
  const calculationResults = calculateHouseholdTotals(appliances, {
    electricityRate: Number(settings.electricityRate) || 0,
    daysInMonth: Number(settings.daysInMonth) || 30,
    daysInYear: Number(settings.daysInYear) || 365,
  });

  // Appliance CRUD actions
  const handleUpdateAppliance = (id, updates) => {
    setAppliances((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteAppliance = (id) => {
    setAppliances((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDuplicateAppliance = (id) => {
    const existing = appliances.find((item) => item.id === id);
    if (!existing) return;
    const duplicated = {
      ...existing,
      id: `app-${Date.now()}`,
      customName: `${existing.customName} (Copy)`,
    };
    setAppliances((prev) => [...prev, duplicated]);
  };

  const handleAddNewAppliance = (applianceSlug) => {
    const meta = getApplianceBySlug(applianceSlug);
    if (!meta) return;
    const newApp = {
      id: `app-${Date.now()}`,
      applianceSlug: meta.slug,
      customName: meta.name,
      watts: meta.defaultWatts,
      quantity: 1,
      hoursPerDay: meta.defaultHours,
      isEnabled: true,
    };
    setAppliances((prev) => [...prev, newApp]);
    setNotification(`Added "${meta.name}" to your list.`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddCustomAppliance = () => {
    const newApp = {
      id: `app-${Date.now()}`,
      applianceSlug: 'custom',
      customName: 'Custom Appliance',
      watts: 100,
      quantity: 1,
      hoursPerDay: 4,
      isEnabled: true,
    };
    setAppliances((prev) => [...prev, newApp]);
    setNotification('Added Custom Appliance to your list.');
    setTimeout(() => setNotification(''), 3000);
  };

  // Household Profile loading
  const handleLoadHousehold = (household) => {
    setAppliances(household.appliances);
    if (household.settings) {
      setSettings(household.settings);
    }
    setNotification(`Loaded profile: "${household.name}"`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleResetHousehold = (defaultConfig) => {
    setAppliances(defaultConfig.appliances);
    setSettings(defaultConfig.settings);
    setNotification('Reset calculator to default household setup.');
    setTimeout(() => setNotification(''), 4000);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'axiscaculator',
        url: 'https://axiscaculator.com/',
        description: 'Transparent household electricity consumption and running cost calculator.',
      },
      {
        '@type': 'WebApplication',
        name: 'axiscaculator Household Electricity Calculator',
        url: 'https://axiscaculator.com/',
        description:
          'Calculate electricity consumption and monthly costs for household appliances with customizable power ratings, operating hours, and electricity tariffs.',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
      },
    ],
  };

  return (
    <div className="space-y-10 pb-16">
      <SEOHead
        title="Household Electricity Cost Calculator | axiscaculator"
        description="Estimate electricity consumption (kWh) and monthly bills (₹) for home appliances. Customize watts, operating hours, and tariffs with 100% transparent formulas."
        canonicalPath="/"
        schema={schema}
      />

      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Independent & Transparent Energy Modeling</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Household Electricity <span className="text-emerald-600">Cost Calculator</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Estimate your daily, monthly, and annual power costs by configuring multiple appliances.
          Edit power ratings, operating hours, and your local electricity tariff in real time.
        </p>
      </section>

      {/* Floating Toast Notification (Zero CLS: does not shift document flow) */}
      <div className="fixed top-20 right-4 sm:right-6 z-50 pointer-events-none max-w-sm w-full" aria-live="polite">
        {notification && (
          <div className="flex items-center gap-2.5 bg-emerald-600 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-xl shadow-emerald-950/20 font-medium pointer-events-auto transition-all animate-fade-in">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{notification}</span>
            <button
              type="button"
              onClick={() => setNotification('')}
              className="text-white/80 hover:text-white text-xs ml-1 focus:outline-none"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Main Totals Card */}
      <section aria-label="Calculation Summary">
        <TotalsCard
          totals={calculationResults.totals}
          items={calculationResults.items}
          period={period}
          setPeriod={setPeriod}
          periodDays={periodDays}
          daysInMonth={settings.daysInMonth}
          setDaysInMonth={setDaysInMonth}
          daysInYear={settings.daysInYear}
          electricityRate={settings.electricityRate}
          setElectricityRate={setElectricityRate}
        />
      </section>

      {/* Multi-Appliance List Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <span>Your Household Appliances ({appliances.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Check/uncheck to include or exclude items. Click any wattage or hours to edit.
            </p>
          </div>

          {/* Household Control Toolbar */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-sm shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              Add Appliance
            </button>

            <button
              type="button"
              onClick={() => setIsManageModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
              title="Save or load household presets"
            >
              <FolderOpen className="w-4 h-4 text-slate-500" />
              <span>Profiles</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
              title="Export, Print, or Share report"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>Export & Share</span>
            </button>
          </div>
        </div>

        {/* Quick Add Preset Bar - Showing Top Appliances from Various Categories */}
        <div className="bg-slate-100/80 rounded-xl p-3 border border-slate-200/80 flex flex-wrap items-center gap-2 text-xs no-print">
          <span className="font-semibold text-slate-600 flex items-center gap-1 mr-1">
            <Plus className="w-3.5 h-3.5 text-emerald-600" /> Quick Add:
          </span>
          {[
            { label: 'Ceiling Fan', slug: 'ceiling-fan' },
            { label: 'Refrigerator', slug: 'refrigerator' },
            { label: 'Air Conditioner', slug: 'air-conditioner' },
            { label: 'Television', slug: 'television' },
            { label: 'Laptop', slug: 'laptop' },
            { label: 'Washing Machine', slug: 'washing-machine' },
            { label: 'Geyser', slug: 'geyser' },
            { label: 'Microwave', slug: 'microwave' },
            { label: 'LED Bulb', slug: 'led-bulb' },
          ].map((app) => (
            <button
              key={app.slug}
              type="button"
              onClick={() => handleAddNewAppliance(app.slug)}
              className="bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium transition-colors"
            >
              + {app.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="text-emerald-700 font-semibold hover:underline ml-auto flex items-center gap-1 text-[11px]"
          >
            + Browse All 15 Categories →
          </button>
        </div>

        {/* Appliances List */}
        <div className="space-y-3">
          {appliances.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 space-y-3">
              <Zap className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-base font-semibold text-slate-700">No appliances in list</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add an appliance from any of the 15 categories to start calculating.
              </p>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
              >
                + Add First Appliance
              </button>
            </div>
          ) : (
            appliances.map((item) => (
              <ApplianceRow
                key={item.id}
                item={item}
                period={period}
                periodDays={periodDays}
                electricityRate={settings.electricityRate}
                onUpdate={handleUpdateAppliance}
                onDelete={handleDeleteAppliance}
                onDuplicate={handleDuplicateAppliance}
              />
            ))
          )}
        </div>
      </section>

      {/* Educational & GEO Content Box */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 content-visibility-auto">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            How This Household Calculator Works
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The axiscaculator calculation engine computes energy consumption using direct,
            unrounded physical equations. Each appliance's daily power draw is determined by its
            rated wattage in Watts (W), quantity, and average operational hours per day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Formula 1: Daily Energy
            </div>
            <code className="text-xs block bg-white p-2 rounded border border-slate-200 text-slate-800 font-mono">
              Daily kWh = Watts × Qty × Hours ÷ 1000
            </code>
            <p className="text-xs text-slate-600">
              One kilowatt-hour (kWh) equals 1,000 Watt-hours. In India, 1 kWh equals 1 Electricity Unit.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Formula 2: Period Energy
            </div>
            <code className="text-xs block bg-white p-2 rounded border border-slate-200 text-slate-800 font-mono">
              Period kWh = Daily kWh × Days
            </code>
            <p className="text-xs text-slate-600">
              Monthly calculations use 28, 30, or 31 days. Yearly projections use 365 days.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Formula 3: Period Cost
            </div>
            <code className="text-xs block bg-white p-2 rounded border border-slate-200 text-slate-800 font-mono">
              Period Cost (₹) = Period kWh × Rate (₹/kWh)
            </code>
            <p className="text-xs text-slate-600">
              Total household bill is computed by summing the costs of all active appliances.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Want to learn how slab tariffs, fixed charges, and solar net metering affect your final bill?
          </div>
          <Link
            to="/how-electricity-cost-is-calculated"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Read the Full Electricity Calculation Guide <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Directory Callout Banner */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-emerald-700/10 content-visibility-auto">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold">Need detailed appliance-specific estimates?</h2>
          <p className="text-emerald-100 text-sm max-w-xl">
            Explore our dedicated calculators for all 15 planned appliances—from inverter ACs and BLDC fans
            to induction geysers and refrigerators—with worked examples, duty cycle insights, and energy-saving tips.
          </p>
        </div>
        <Link
          to="/appliance-cost-calculator"
          className="shrink-0 px-5 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105"
        >
          Browse Appliance Directory →
        </Link>
      </section>

      {/* Modals */}
      <AddApplianceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelectAppliance={handleAddNewAppliance}
        onAddCustom={handleAddCustomAppliance}
      />

      <HouseholdManagerModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        currentAppliances={appliances}
        currentSettings={settings}
        onLoadHousehold={handleLoadHousehold}
        onResetHousehold={handleResetHousehold}
      />

      <ExportShareModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        appliances={appliances}
        settings={settings}
        totals={calculationResults.totals}
        period={period}
        periodDays={periodDays}
      />
    </div>
  );
}

import React from 'react';
import { IndianRupee, Zap, Calendar, Info, Layers } from 'lucide-react';
import { formatCurrency, formatEnergy, formatPercent } from '../../utils/formatting';
import { validateRate } from '../../utils/validation';

export function TotalsCard({
  totals,
  items,
  period,
  setPeriod,
  periodDays,
  setDaysInMonth,
  daysInMonth,
  daysInYear,
  electricityRate,
  setElectricityRate,
}) {
  const rateValidation = validateRate(electricityRate);

  // Determine current period totals based on selected period
  let currentCost = totals.monthlyCost;
  let currentEnergy = totals.monthlyKwh;

  if (period === 'daily') {
    currentCost = totals.dailyCost;
    currentEnergy = totals.dailyKwh;
  } else if (period === 'yearly') {
    currentCost = totals.yearlyCost;
    currentEnergy = totals.yearlyKwh;
  }

  // Predefined common Indian state average tariffs
  const tariffSuggestions = [6.0, 7.0, 8.5, 10.0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-6 lg:p-7 shadow-xl border border-slate-800 space-y-6">
      {/* Top: Tariff Settings & Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        {/* Period Selector Tabs */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Calculation Period
          </span>
          <div className="inline-flex p-1 bg-slate-800 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setPeriod('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'daily'
                  ? 'bg-emerald-500 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Daily (1 Day)
            </button>
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'monthly'
                  ? 'bg-emerald-500 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Monthly ({daysInMonth} Days)
            </button>
            <button
              type="button"
              onClick={() => setPeriod('yearly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'yearly'
                  ? 'bg-emerald-500 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Yearly ({daysInYear} Days)
            </button>
          </div>
        </div>

        {/* Days in Month Sub-Selector (shown when monthly selected) */}
        {period === 'monthly' && (
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-slate-300 font-medium">Month Days:</span>
            <div className="flex items-center gap-1">
              {[28, 30, 31].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDaysInMonth(d)}
                  className={`text-xs px-2 py-0.5 rounded font-medium transition-colors ${
                    daysInMonth === d
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Numbers: Total Cost and Total Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Estimated Cost */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <IndianRupee className="w-4 h-4" />
            <span>Total Estimated Cost</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black tracking-tight text-white tabular-nums">
            {formatCurrency(currentCost)}
          </div>
          <p className="text-xs text-slate-400">
            Calculated for <strong className="text-slate-200">{periodDays} days</strong> at ₹{electricityRate}/unit
          </p>
        </div>

        {/* Total Energy Consumed */}
        <div className="space-y-1 md:border-l md:border-slate-800 md:pl-6">
          <div className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Total Energy Consumption</span>
          </div>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-teal-100 tabular-nums">
            {formatEnergy(currentEnergy)}
          </div>
          <p className="text-xs text-slate-400">
            Equals <strong className="text-slate-200">{formatEnergy(currentEnergy, { showUnitLabel: false })} Units</strong> on your electricity meter
          </p>
        </div>
      </div>

      {/* Electricity Tariff Rate Input */}
      <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label htmlFor="rate-input" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <span>Electricity Tariff Rate (₹ / kWh)</span>
            <span className="text-[11px] font-normal text-slate-400">
              (1 kWh = 1 Electricity Unit)
            </span>
          </label>
          {/* Quick preset tariff badges */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Typical:</span>
            {tariffSuggestions.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setElectricityRate(rate)}
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                  electricityRate === rate
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                ₹{rate}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-2 text-sm text-slate-400 font-semibold pointer-events-none">
              ₹
            </span>
            <input
              id="rate-input"
              type="number"
              min="0"
              step="0.25"
              value={electricityRate}
              onChange={(e) => setElectricityRate(e.target.value === '' ? '' : Number(e.target.value))}
              className={`w-full bg-slate-900 text-white font-bold pl-7 pr-16 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                !rateValidation.isValid
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-700 focus:ring-emerald-500'
              }`}
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400 pointer-events-none">
              / Unit (kWh)
            </span>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            {totals.activeAppliancesCount} active appliance{totals.activeAppliancesCount !== 1 ? 's' : ''} ({totals.totalUnitsCount} total units)
          </div>
        </div>
        {!rateValidation.isValid && (
          <span className="text-xs text-rose-400 block font-medium">
            {rateValidation.error}
          </span>
        )}
      </div>

      {/* Energy Share Breakdown Visual Bar */}
      {totals.monthlyKwh > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Appliance Consumption Share
            </span>
            <span>Hover or inspect share %</span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
            {items
              .filter((item) => item.isEnabled && item.sharePercentage > 0)
              .map((item, idx) => {
                const colors = [
                  'bg-emerald-500',
                  'bg-teal-400',
                  'bg-sky-400',
                  'bg-indigo-400',
                  'bg-amber-400',
                  'bg-rose-400',
                  'bg-purple-400',
                ];
                const color = colors[idx % colors.length];
                return (
                  <div
                    key={item.id}
                    style={{ width: `${item.sharePercentage}%` }}
                    className={`${color} h-full transition-all duration-300 relative group cursor-pointer`}
                    title={`${item.customName}: ${formatPercent(item.sharePercentage)} of bill (${formatCurrency(
                      (item.sharePercentage / 100) * currentCost
                    )})`}
                  />
                );
              })}
          </div>

          {/* Legend chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {items
              .filter((item) => item.isEnabled && item.sharePercentage > 1)
              .map((item, idx) => {
                const colors = [
                  'bg-emerald-500',
                  'bg-teal-400',
                  'bg-sky-400',
                  'bg-indigo-400',
                  'bg-amber-400',
                  'bg-rose-400',
                  'bg-purple-400',
                ];
                const dotColor = colors[idx % colors.length];
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md"
                  >
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <span className="truncate max-w-[120px]">{item.customName}</span>
                    <span className="font-semibold text-slate-200">
                      {formatPercent(item.sharePercentage, 0)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Disclaimers notice */}
      <div className="text-[11px] text-slate-400 bg-slate-850/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Estimates reflect raw electrical energy charges (kWh × ₹). Excludes fixed meter rentals, tariff slabs, power factor penalties, or government taxes. Inverter appliances and thermostats fluctuate during actual use.
        </p>
      </div>
    </div>
  );
}

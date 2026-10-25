import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Zap, Filter } from 'lucide-react';
import { ApplianceIcon } from '../components/common/ApplianceIcon';
import { SEOHead } from '../components/common/SEOHead';
import { APPLIANCES, APPLIANCE_CATEGORIES } from '../data/appliances';
import { formatCurrency, formatEnergy } from '../utils/formatting';

export function ApplianceDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter appliances based on search query and category
  const filteredAppliances = APPLIANCES.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Appliance Electricity Cost Directory',
        url: 'https://axiscaculator.com/appliance-cost-calculator',
        description:
          'Complete catalogue of 15 household electrical appliances with wattage ratings, duty cycle limitations, and running cost calculators.',
      },
    ],
  };

  return (
    <div className="space-y-10 pb-16">
      <SEOHead
        title="Appliance Electricity Directory — 15 Household Calculators | axiscaculator"
        description="Browse dedicated electricity calculators and power ratings for all 15 home appliances including air conditioners, refrigerators, BLDC fans, geysers, and washing machines."
        canonicalPath="/appliance-cost-calculator"
        schema={schema}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">Appliance Directory</span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Appliance Electricity <span className="text-emerald-600">Cost Directory</span>
        </h1>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          Select any of the 15 appliances below to access its dedicated calculator, examine duty cycle
          caveats, review worked examples, and estimate daily, monthly, and yearly costs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search appliance (e.g. Inverter AC, Fan, Geyser)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Search appliances"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-1 hidden lg:inline" />
          {APPLIANCE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Appliances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppliances.map((app) => {
          // Calculate quick baseline monthly estimate (at ₹7/kWh, 30 days)
          const baselineDailyKwh = (app.defaultWatts * 1 * app.defaultHours) / 1000;
          const baselineMonthlyKwh = baselineDailyKwh * 30;
          const baselineMonthlyCost = baselineMonthlyKwh * 7;

          return (
            <div
              key={app.slug}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <ApplianceIcon name={app.iconName} className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {app.category}
                  </span>
                </div>

                {/* Name & Description */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {app.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {app.shortDescription}
                  </p>
                </div>

                {/* Specifications Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Typical Power
                    </span>
                    <span className="font-bold text-slate-800">
                      {app.typicalWattageRange.label}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Typical Usage
                    </span>
                    <span className="font-bold text-slate-800">
                      {app.typicalHoursRange}
                    </span>
                  </div>
                </div>

                {/* Example monthly running cost at ₹7/kWh */}
                <div className="flex items-center justify-between text-xs bg-emerald-50/60 p-3 rounded-xl border border-emerald-100/80">
                  <span className="text-emerald-900 font-medium">Est. Monthly Cost:</span>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-sm">
                      {formatCurrency(baselineMonthlyCost, { decimals: 0 })}
                    </span>
                    <span className="text-[10px] text-emerald-600 block">
                      (~{formatEnergy(baselineMonthlyKwh, { decimals: 0 })}/mo)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-100">
                <Link
                  to={`/electricity-cost/${app.slug}`}
                  className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-slate-100 group-hover:bg-emerald-600 text-slate-800 group-hover:text-white font-semibold text-xs transition-colors"
                >
                  <span>Open {app.name} Calculator</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAppliances.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
          <Zap className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-base font-bold text-slate-800">No appliances match "{searchQuery}"</div>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or reset the category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

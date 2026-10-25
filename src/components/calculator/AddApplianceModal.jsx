import React, { useState } from 'react';
import { X, Search, Plus, Zap, Check } from 'lucide-react';
import { ApplianceIcon } from '../common/ApplianceIcon';
import { APPLIANCES, APPLIANCE_CATEGORIES } from '../../data/appliances';
import { formatPower } from '../../utils/formatting';

export function AddApplianceModal({ isOpen, onClose, onSelectAppliance, onAddCustom }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [recentlyAdded, setRecentlyAdded] = useState(null);

  if (!isOpen) return null;

  const filtered = APPLIANCES.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (slug) => {
    onSelectAppliance(slug);
    setRecentlyAdded(slug);
    setTimeout(() => {
      setRecentlyAdded(null);
      onClose();
    }, 400);
  };

  const handleCustom = () => {
    onAddCustom();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add Appliance to Calculator</h2>
              <p className="text-xs text-slate-500">Choose from 15 categories or create a custom device</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search appliances (e.g. TV, Fridge, Fan, Laptop, Geyser)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {APPLIANCE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Appliance List Grid */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-2 max-h-[50vh]">
          {/* Custom Appliance Option */}
          <button
            type="button"
            onClick={handleCustom}
            className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm group-hover:text-emerald-700">
                  + Add Custom Appliance
                </div>
                <div className="text-xs text-slate-500">
                  Specify custom name, power in Watts, and operating hours
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white rounded-lg text-slate-700 transition-colors">
              Add Custom
            </span>
          </button>

          {filtered.map((app) => (
            <button
              key={app.slug}
              type="button"
              onClick={() => handleAdd(app.slug)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 text-left transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ApplianceIcon name={app.iconName} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm truncate group-hover:text-emerald-700">
                      {app.name}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                      {app.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Typical: {formatPower(app.defaultWatts)} • {app.defaultHours} hrs/day
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {recentlyAdded === app.slug ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                    <Check className="w-4 h-4" /> Added
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-3 py-1 bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white rounded-lg text-slate-700 transition-colors">
                    + Add
                  </span>
                )}
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No appliances found matching "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

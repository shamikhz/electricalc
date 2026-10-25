import React from 'react';
import { Trash2, Copy } from 'lucide-react';
import { ApplianceIcon } from '../common/ApplianceIcon';
import { getApplianceBySlug } from '../../data/appliances';
import { formatCurrency, formatEnergy } from '../../utils/formatting';
import { validateWatts, validateQuantity, validateHours } from '../../utils/validation';

export function ApplianceRow({
  item,
  period,
  periodDays,
  electricityRate,
  onUpdate,
  onDelete,
  onDuplicate,
}) {
  const applianceMeta = getApplianceBySlug(item.applianceSlug);

  // Validate fields
  const wattsValidation = validateWatts(item.watts);
  const qtyValidation = validateQuantity(item.quantity);
  const hoursValidation = validateHours(item.hoursPerDay);

  const hasErrors = !wattsValidation.isValid || !qtyValidation.isValid || !hoursValidation.isValid;

  // Handle switching appliance type across all categories
  const handleApplianceTypeChange = (e) => {
    const slug = e.target.value;
    if (slug === 'custom') {
      onUpdate(item.id, {
        applianceSlug: 'custom',
        customName: 'Custom Appliance',
      });
      return;
    }
    const meta = getApplianceBySlug(slug);
    if (meta) {
      onUpdate(item.id, {
        applianceSlug: meta.slug,
        customName: meta.name,
        watts: meta.defaultWatts,
        hoursPerDay: meta.defaultHours,
      });
    }
  };

  // Handle preset selection within current appliance
  const handlePresetChange = (e) => {
    const val = e.target.value;
    if (!val || val === 'custom') return;

    const foundPreset = applianceMeta?.presets?.find((p) => p.label === val);
    if (foundPreset) {
      onUpdate(item.id, {
        watts: foundPreset.watts,
        customName: `${applianceMeta.name} (${foundPreset.label})`,
      });
    }
  };

  // Compute stats for current period
  const dailyKwh = (Number(item.watts) * Number(item.quantity) * Number(item.hoursPerDay)) / 1000;
  const periodKwh = dailyKwh * Number(periodDays);
  const periodCost = periodKwh * Number(electricityRate);

  return (
    <div
      className={`rounded-xl border transition-all ${
        !item.isEnabled
          ? 'bg-slate-50/70 border-slate-200 opacity-60'
          : hasErrors
          ? 'bg-rose-50/30 border-rose-300 shadow-sm'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
      } p-4 sm:p-5`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Checkbox, Icon, Name & Presets */}
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={item.isEnabled !== false}
            onChange={(e) => onUpdate(item.id, { isEnabled: e.target.checked })}
            className="mt-1 sm:mt-0 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
            id={`toggle-${item.id}`}
            aria-label={`Enable or disable ${item.customName}`}
          />

          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <ApplianceIcon name={applianceMeta?.iconName || 'Zap'} className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={item.customName}
                onChange={(e) => onUpdate(item.id, { customName: e.target.value })}
                className="font-semibold text-slate-800 text-sm sm:text-base bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white px-1 py-0.5 rounded focus:outline-none transition-colors max-w-xs"
                placeholder="Appliance label"
                aria-label="Appliance description"
              />
              {applianceMeta && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {applianceMeta.category}
                </span>
              )}
            </div>

            {/* Appliance Type Selector & Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <select
                value={item.applianceSlug || 'custom'}
                onChange={handleApplianceTypeChange}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                aria-label={`Change appliance type for ${item.customName}`}
              >
                <optgroup label="❄️ Cooling & Heating">
                  <option value="air-conditioner">Air Conditioner</option>
                  <option value="ceiling-fan">Ceiling Fan</option>
                  <option value="geyser">Geyser (Water Heater)</option>
                  <option value="room-heater">Room Heater</option>
                  <option value="air-cooler">Air Cooler</option>
                </optgroup>
                <optgroup label="🍳 Kitchen">
                  <option value="refrigerator">Refrigerator</option>
                  <option value="microwave">Microwave Oven</option>
                  <option value="electric-kettle">Electric Kettle</option>
                </optgroup>
                <optgroup label="💻 Entertainment & Work">
                  <option value="television">Television</option>
                  <option value="laptop">Laptop</option>
                  <option value="desktop-computer">Desktop Computer</option>
                </optgroup>
                <optgroup label="🧺 Cleaning & Utility">
                  <option value="washing-machine">Washing Machine</option>
                  <option value="water-pump">Water Pump</option>
                  <option value="electric-iron">Electric Iron</option>
                </optgroup>
                <optgroup label="💡 Lighting">
                  <option value="led-bulb">LED Bulb</option>
                </optgroup>
                <optgroup label="⚙️ Other">
                  <option value="custom">Custom Appliance</option>
                </optgroup>
              </select>

              {/* Presets dropdown (if available for selected appliance) */}
              {applianceMeta?.presets && (
                <select
                  onChange={handlePresetChange}
                  value=""
                  className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer max-w-[200px] truncate"
                  aria-label={`Select power preset for ${item.customName}`}
                >
                  <option value="" disabled>
                    ⚡ Choose Wattage Preset...
                  </option>
                  {applianceMeta.presets.map((preset) => (
                    <option key={preset.label} value={preset.label}>
                      {preset.label} ({preset.watts}W)
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Editable Inputs (Watts, Quantity, Hours) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
          {/* Power (Watts) */}
          <div>
            <label
              htmlFor={`watts-${item.id}`}
              className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1"
            >
              Power (Watts)
            </label>
            <div className="relative">
              <input
                id={`watts-${item.id}`}
                type="number"
                min="1"
                step="1"
                value={item.watts}
                onChange={(e) => onUpdate(item.id, { watts: e.target.value })}
                className={`w-full text-sm font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 ${
                  !wattsValidation.isValid
                    ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-rose-400'
                    : 'border-slate-200 bg-white text-slate-800 focus:ring-emerald-500'
                }`}
              />
              <span className="absolute right-2 top-1.5 text-xs text-slate-400 pointer-events-none">
                W
              </span>
            </div>
            {!wattsValidation.isValid && (
              <span className="text-[10px] text-rose-600 font-medium block mt-0.5">
                {wattsValidation.error}
              </span>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor={`qty-${item.id}`}
              className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1"
            >
              Quantity
            </label>
            <input
              id={`qty-${item.id}`}
              type="number"
              min="1"
              step="1"
              value={item.quantity}
              onChange={(e) => onUpdate(item.id, { quantity: e.target.value })}
              className={`w-full text-sm font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 ${
                !qtyValidation.isValid
                  ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-rose-400'
                  : 'border-slate-200 bg-white text-slate-800 focus:ring-emerald-500'
              }`}
            />
            {!qtyValidation.isValid && (
              <span className="text-[10px] text-rose-600 font-medium block mt-0.5">
                {qtyValidation.error}
              </span>
            )}
          </div>

          {/* Daily Hours */}
          <div>
            <label
              htmlFor={`hours-${item.id}`}
              className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1"
            >
              Hours / Day
            </label>
            <div className="relative">
              <input
                id={`hours-${item.id}`}
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={item.hoursPerDay}
                onChange={(e) => onUpdate(item.id, { hoursPerDay: e.target.value })}
                className={`w-full text-sm font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 ${
                  !hoursValidation.isValid
                    ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-rose-400'
                    : 'border-slate-200 bg-white text-slate-800 focus:ring-emerald-500'
                }`}
              />
              <span className="absolute right-2 top-1.5 text-xs text-slate-400 pointer-events-none">
                h
              </span>
            </div>
            {!hoursValidation.isValid && (
              <span className="text-[10px] text-rose-600 font-medium block mt-0.5">
                {hoursValidation.error}
              </span>
            )}
          </div>
        </div>

        {/* Right: Calculated Cost and Row Action Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-right min-w-[95px] shrink-0 tabular-nums">
            <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
              {item.isEnabled && !hasErrors ? formatCurrency(periodCost) : '₹0.00'}
            </div>
            <div className="text-xs text-slate-500 tabular-nums">
              {item.isEnabled && !hasErrors
                ? `${formatEnergy(periodKwh)} / ${period}`
                : 'Disabled'}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDuplicate(item.id)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Duplicate appliance"
              aria-label={`Duplicate ${item.customName}`}
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Remove appliance"
              aria-label={`Remove ${item.customName}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Formatting utilities for currency (₹ INR), energy (kWh/Units), power (Watts/kW), and numbers.
 */

/**
 * Formats a currency value in Indian Rupees (₹).
 * @param {number} amount
 * @param {Object} [options]
 * @param {number} [options.decimals=2]
 * @param {boolean} [options.compact=false]
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, { decimals = 2, compact = false } = {}) {
  const num = Number(amount);
  if (!Number.isFinite(num)) return '₹0.00';

  if (compact && Math.abs(num) >= 100000) {
    // Format in Lakhs for large values if compact requested
    return `₹${(num / 100000).toFixed(2)}L`;
  }

  // Format with standard Indian numbering convention or en-IN
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Formats electricity consumption in kilowatt-hours (kWh or Units).
 * @param {number} kwh
 * @param {Object} [options]
 * @param {number} [options.decimals=2]
 * @param {boolean} [options.showUnitLabel=true]
 * @returns {string} Formatted energy string
 */
export function formatEnergy(kwh, { decimals = 2, showUnitLabel = true } = {}) {
  const num = Number(kwh);
  if (!Number.isFinite(num)) return showUnitLabel ? '0.00 kWh' : '0.00';

  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return showUnitLabel ? `${formatted} kWh` : formatted;
}

/**
 * Formats electrical power (W or kW).
 * @param {number} watts
 * @returns {string} e.g. "75 W" or "1,500 W (1.5 kW)"
 */
export function formatPower(watts) {
  const num = Number(watts);
  if (!Number.isFinite(num) || num <= 0) return '0 W';

  if (num >= 1000) {
    const kw = (num / 1000).toLocaleString('en-IN', { maximumFractionDigits: 2 });
    return `${num.toLocaleString('en-IN')} W (${kw} kW)`;
  }
  return `${num.toLocaleString('en-IN')} W`;
}

/**
 * Formats hours per day.
 * @param {number} hours
 * @returns {string}
 */
export function formatHours(hours) {
  const num = Number(hours);
  if (!Number.isFinite(num)) return '0 hrs';
  if (num === 1) return '1 hr/day';
  return `${num} hrs/day`;
}

/**
 * Formats a percentage.
 * @param {number} percent
 * @param {number} [decimals=1]
 * @returns {string}
 */
export function formatPercent(percent, decimals = 1) {
  const num = Number(percent);
  if (!Number.isFinite(num)) return '0%';
  return `${num.toFixed(decimals)}%`;
}

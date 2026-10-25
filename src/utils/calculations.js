/**
 * Centralized Calculation Engine for axiscaculator
 * 
 * Formulas:
 * Daily Energy (kWh) = watts * quantity * hoursPerDay / 1000
 * Period Energy (kWh) = dailyEnergy * numberOfDays
 * Period Cost (₹) = periodEnergy * electricityRate
 * 
 * Rules:
 * - Unrounded internal calculations
 * - Presentation formatting handled separately
 * - Handles zero usage, zero rate, decimal inputs safely
 */

/**
 * Calculates daily energy consumption in kilowatt-hours (kWh).
 * @param {number} watts - Power rating in watts (must be > 0)
 * @param {number} quantity - Number of units (must be positive integer >= 1)
 * @param {number} hoursPerDay - Daily operating hours (0 to 24)
 * @returns {number} Daily energy in kWh
 */
export function calculateDailyEnergy(watts, quantity = 1, hoursPerDay = 1) {
  const w = Number(watts);
  const q = Number(quantity);
  const h = Number(hoursPerDay);

  if (isNaN(w) || isNaN(q) || isNaN(h)) return 0;
  if (w <= 0 || q <= 0 || h < 0) return 0;
  if (h > 24) return (w * q * 24) / 1000;

  return (w * q * h) / 1000;
}

/**
 * Calculates energy consumption for an arbitrary period of days.
 * @param {number} dailyKwh - Daily energy in kWh
 * @param {number} numberOfDays - Duration in days
 * @returns {number} Period energy in kWh
 */
export function calculatePeriodEnergy(dailyKwh, numberOfDays) {
  const kwh = Number(dailyKwh);
  const days = Number(numberOfDays);

  if (isNaN(kwh) || isNaN(days) || kwh < 0 || days < 0) return 0;
  return kwh * days;
}

/**
 * Calculates period cost in rupees (₹).
 * @param {number} periodKwh - Period energy in kWh
 * @param {number} electricityRate - Electricity tariff in ₹/kWh
 * @returns {number} Period cost in ₹
 */
export function calculatePeriodCost(periodKwh, electricityRate) {
  const kwh = Number(periodKwh);
  const rate = Number(electricityRate);

  if (isNaN(kwh) || isNaN(rate) || kwh < 0 || rate < 0) return 0;
  return kwh * rate;
}

/**
 * Computes full daily, monthly, and yearly statistics for a single appliance.
 * @param {Object} params
 * @param {number} params.watts - Power in Watts
 * @param {number} [params.quantity=1] - Appliance count
 * @param {number} [params.hoursPerDay=1] - Hours per day
 * @param {number} [params.electricityRate=7] - ₹/kWh
 * @param {number} [params.daysInMonth=30] - 28, 30, or 31 days
 * @param {number} [params.daysInYear=365] - Number of days in year (default 365)
 * @returns {Object} Complete consumption and cost breakdown
 */
export function calculateApplianceStats({
  watts,
  quantity = 1,
  hoursPerDay = 1,
  electricityRate = 7,
  daysInMonth = 30,
  daysInYear = 365,
}) {
  const dailyKwh = calculateDailyEnergy(watts, quantity, hoursPerDay);
  const monthlyKwh = calculatePeriodEnergy(dailyKwh, daysInMonth);
  const yearlyKwh = calculatePeriodEnergy(dailyKwh, daysInYear);

  const dailyCost = calculatePeriodCost(dailyKwh, electricityRate);
  const monthlyCost = calculatePeriodCost(monthlyKwh, electricityRate);
  const yearlyCost = calculatePeriodCost(yearlyKwh, electricityRate);

  return {
    dailyKwh,
    monthlyKwh,
    yearlyKwh,
    dailyCost,
    monthlyCost,
    yearlyCost,
    daysInMonth: Number(daysInMonth) || 30,
    daysInYear: Number(daysInYear) || 365,
    electricityRate: Number(electricityRate) || 0,
    watts: Number(watts) || 0,
    quantity: Number(quantity) || 1,
    hoursPerDay: Number(hoursPerDay) || 0,
  };
}

/**
 * Calculates household totals across an array of appliances.
 * @param {Array<Object>} appliances - Array of appliance configurations
 * @param {Object} options
 * @param {number} [options.electricityRate=7] - ₹/kWh
 * @param {number} [options.daysInMonth=30] - 28, 30, or 31 days
 * @param {number} [options.daysInYear=365] - Default 365
 * @returns {Object} Household totals with individual item breakdowns and percentage shares
 */
export function calculateHouseholdTotals(appliances = [], {
  electricityRate = 7,
  daysInMonth = 30,
  daysInYear = 365,
} = {}) {
  const items = appliances.map((app) => {
    // Only calculate if appliance is enabled (default to true if undefined)
    const isEnabled = app.isEnabled !== false;
    const stats = isEnabled
      ? calculateApplianceStats({
          watts: app.watts,
          quantity: app.quantity ?? 1,
          hoursPerDay: app.hoursPerDay ?? 1,
          electricityRate,
          daysInMonth,
          daysInYear,
        })
      : {
          dailyKwh: 0,
          monthlyKwh: 0,
          yearlyKwh: 0,
          dailyCost: 0,
          monthlyCost: 0,
          yearlyCost: 0,
          daysInMonth,
          daysInYear,
          electricityRate,
          watts: app.watts || 0,
          quantity: app.quantity || 1,
          hoursPerDay: app.hoursPerDay || 0,
        };

    return {
      ...app,
      isEnabled,
      stats,
    };
  });

  const totals = items.reduce(
    (acc, item) => {
      acc.dailyKwh += item.stats.dailyKwh;
      acc.monthlyKwh += item.stats.monthlyKwh;
      acc.yearlyKwh += item.stats.yearlyKwh;
      acc.dailyCost += item.stats.dailyCost;
      acc.monthlyCost += item.stats.monthlyCost;
      acc.yearlyCost += item.stats.yearlyCost;
      if (item.isEnabled) {
        acc.activeAppliancesCount += 1;
        acc.totalUnitsCount += Number(item.quantity) || 1;
      }
      return acc;
    },
    {
      dailyKwh: 0,
      monthlyKwh: 0,
      yearlyKwh: 0,
      dailyCost: 0,
      monthlyCost: 0,
      yearlyCost: 0,
      activeAppliancesCount: 0,
      totalUnitsCount: 0,
    }
  );

  // Calculate percentage shares of total consumption for visualization
  const itemsWithShares = items.map((item) => {
    const sharePercentage =
      totals.monthlyKwh > 0 && item.isEnabled
        ? (item.stats.monthlyKwh / totals.monthlyKwh) * 100
        : 0;
    return {
      ...item,
      sharePercentage,
    };
  });

  return {
    totals,
    items: itemsWithShares,
    electricityRate: Number(electricityRate) || 0,
    daysInMonth: Number(daysInMonth) || 30,
    daysInYear: Number(daysInYear) || 365,
  };
}

/**
 * Calculates comparative difference and energy/money savings between two appliance configs.
 * Also calculates payback period if price difference is provided.
 * @param {Object} baselineAppliance - Baseline / higher consuming appliance (e.g. Old 75W Fan)
 * @param {Object} efficientAppliance - Efficient / proposed appliance (e.g. 28W BLDC Fan)
 * @param {Object} options
 * @param {number} [options.electricityRate=7]
 * @param {number} [options.daysInMonth=30]
 * @param {number} [options.daysInYear=365]
 * @param {number} [options.priceDifference=0] - Initial upfront price difference (₹)
 * @returns {Object} Savings and payback metrics
 */
export function calculateComparison(
  baselineAppliance,
  efficientAppliance,
  {
    electricityRate = 7,
    daysInMonth = 30,
    daysInYear = 365,
    priceDifference = 0,
  } = {}
) {
  const statsA = calculateApplianceStats({
    watts: baselineAppliance.watts,
    quantity: baselineAppliance.quantity ?? 1,
    hoursPerDay: baselineAppliance.hoursPerDay ?? 1,
    electricityRate,
    daysInMonth,
    daysInYear,
  });

  const statsB = calculateApplianceStats({
    watts: efficientAppliance.watts,
    quantity: efficientAppliance.quantity ?? 1,
    hoursPerDay: efficientAppliance.hoursPerDay ?? 1,
    electricityRate,
    daysInMonth,
    daysInYear,
  });

  const savedDailyKwh = statsA.dailyKwh - statsB.dailyKwh;
  const savedMonthlyKwh = statsA.monthlyKwh - statsB.monthlyKwh;
  const savedYearlyKwh = statsA.yearlyKwh - statsB.yearlyKwh;

  const savedDailyCost = statsA.dailyCost - statsB.dailyCost;
  const savedMonthlyCost = statsA.monthlyCost - statsB.monthlyCost;
  const savedYearlyCost = statsA.yearlyCost - statsB.yearlyCost;

  const percentageEnergySaved =
    statsA.dailyKwh > 0 ? (savedDailyKwh / statsA.dailyKwh) * 100 : 0;

  // Payback period in months and years
  const priceDiff = Number(priceDifference) || 0;
  let paybackMonths = null;
  let paybackYears = null;

  if (priceDiff > 0 && savedMonthlyCost > 0) {
    paybackMonths = priceDiff / savedMonthlyCost;
    paybackYears = priceDiff / savedYearlyCost;
  }

  return {
    baselineStats: statsA,
    efficientStats: statsB,
    savedDailyKwh,
    savedMonthlyKwh,
    savedYearlyKwh,
    savedDailyCost,
    savedMonthlyCost,
    savedYearlyCost,
    percentageEnergySaved,
    priceDifference: priceDiff,
    paybackMonths,
    paybackYears,
  };
}

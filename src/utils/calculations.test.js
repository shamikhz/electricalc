import { describe, it, expect } from 'vitest';
import {
  calculateDailyEnergy,
  calculatePeriodEnergy,
  calculatePeriodCost,
  calculateApplianceStats,
  calculateHouseholdTotals,
  calculateComparison,
} from './calculations';

describe('Calculation Engine - Single Appliance Calculations', () => {
  it('correctly calculates daily energy in kWh (watts * quantity * hours / 1000)', () => {
    // 75W fan * 2 units * 10 hours = 1500 Wh = 1.5 kWh
    const kwh = calculateDailyEnergy(75, 2, 10);
    expect(kwh).toBe(1.5);
  });

  it('handles fractional hours and wattages correctly', () => {
    // 1500W * 1 * 0.5 hours = 750 Wh = 0.75 kWh
    const kwh = calculateDailyEnergy(1500, 1, 0.5);
    expect(kwh).toBe(0.75);
  });

  it('clamps or returns 0 for zero or invalid inputs safely', () => {
    expect(calculateDailyEnergy(0, 1, 5)).toBe(0);
    expect(calculateDailyEnergy(-50, 1, 5)).toBe(0);
    expect(calculateDailyEnergy(100, 0, 5)).toBe(0);
    expect(calculateDailyEnergy(100, 1, -2)).toBe(0);
    expect(calculateDailyEnergy('invalid', 1, 5)).toBe(0);
  });

  it('caps hours at 24 hours per day max', () => {
    const kwh = calculateDailyEnergy(1000, 1, 30);
    // 1000W * 1 * 24 / 1000 = 24 kWh
    expect(kwh).toBe(24);
  });

  it('calculates period energy for 28, 30, 31, and 365 days accurately', () => {
    const dailyKwh = 2.5;
    expect(calculatePeriodEnergy(dailyKwh, 28)).toBe(70);
    expect(calculatePeriodEnergy(dailyKwh, 30)).toBe(75);
    expect(calculatePeriodEnergy(dailyKwh, 31)).toBe(77.5);
    expect(calculatePeriodEnergy(dailyKwh, 365)).toBe(912.5);
  });

  it('calculates period cost based on tariff rate (₹/kWh)', () => {
    // 100 kWh * ₹7/kWh = ₹700
    expect(calculatePeriodCost(100, 7)).toBe(700);
    expect(calculatePeriodCost(100, 0)).toBe(0);
    expect(calculatePeriodCost(0, 10)).toBe(0);
    expect(calculatePeriodCost(15.5, 8.2)).toBeCloseTo(127.1, 5);
  });

  it('calculates complete appliance stats with unrounded internal values', () => {
    const stats = calculateApplianceStats({
      watts: 1400,
      quantity: 1,
      hoursPerDay: 8,
      electricityRate: 7,
      daysInMonth: 30,
      daysInYear: 365,
    });

    // 1400 * 8 / 1000 = 11.2 kWh/day
    expect(stats.dailyKwh).toBe(11.2);
    // 11.2 * 30 = 336 kWh/month
    expect(stats.monthlyKwh).toBe(336);
    // 11.2 * 365 = 4088 kWh/year
    expect(stats.yearlyKwh).toBeCloseTo(4088, 5);
    // 11.2 * 7 = 78.4 ₹/day
    expect(stats.dailyCost).toBeCloseTo(78.4, 5);
    // 336 * 7 = 2352 ₹/month
    expect(stats.monthlyCost).toBeCloseTo(2352, 5);
    // 4088 * 7 = 28616 ₹/year
    expect(stats.yearlyCost).toBeCloseTo(28616, 5);
  });
});

describe('Calculation Engine - Household Multi-Appliance Totals', () => {
  it('correctly aggregates multiple appliances and calculates shares', () => {
    const appliances = [
      { id: '1', watts: 1000, quantity: 1, hoursPerDay: 1, isEnabled: true }, // 1 kWh/day -> 30 kWh/mo
      { id: '2', watts: 100, quantity: 1, hoursPerDay: 10, isEnabled: true }, // 1 kWh/day -> 30 kWh/mo
    ];

    const result = calculateHouseholdTotals(appliances, {
      electricityRate: 10,
      daysInMonth: 30,
      daysInYear: 365,
    });

    expect(result.totals.dailyKwh).toBe(2);
    expect(result.totals.monthlyKwh).toBe(60);
    expect(result.totals.monthlyCost).toBe(600);
    expect(result.items[0].sharePercentage).toBe(50);
    expect(result.items[1].sharePercentage).toBe(50);
  });

  it('excludes disabled appliances from household totals', () => {
    const appliances = [
      { id: '1', watts: 1000, quantity: 1, hoursPerDay: 1, isEnabled: true }, // 1 kWh
      { id: '2', watts: 2000, quantity: 1, hoursPerDay: 5, isEnabled: false }, // Ignored
    ];

    const result = calculateHouseholdTotals(appliances, {
      electricityRate: 8,
      daysInMonth: 30,
      daysInYear: 365,
    });

    expect(result.totals.dailyKwh).toBe(1);
    expect(result.totals.monthlyKwh).toBe(30);
    expect(result.totals.monthlyCost).toBe(240);
  });
});

describe('Calculation Engine - Comparison and Savings Tool', () => {
  it('correctly computes difference between standard and efficient appliance with payback period', () => {
    const standardFan = { watts: 75, quantity: 2, hoursPerDay: 12 };
    const bldcFan = { watts: 28, quantity: 2, hoursPerDay: 12 };

    const comp = calculateComparison(standardFan, bldcFan, {
      electricityRate: 8,
      daysInMonth: 30,
      daysInYear: 365,
      priceDifference: 2000, // ₹2000 extra cost for 2 BLDC fans
    });

    // Standard: 75 * 2 * 12 / 1000 = 1.8 kWh/day
    // BLDC: 28 * 2 * 12 / 1000 = 0.672 kWh/day
    // Saved Daily = 1.128 kWh/day
    expect(comp.savedDailyKwh).toBeCloseTo(1.128, 3);
    // Saved Monthly = 1.128 * 30 = 33.84 kWh
    expect(comp.savedMonthlyKwh).toBeCloseTo(33.84, 2);
    // Saved Monthly ₹ = 33.84 * 8 = 270.72
    expect(comp.savedMonthlyCost).toBeCloseTo(270.72, 2);
    // Percentage saved = (1.128 / 1.8) * 100 = 62.67%
    expect(comp.percentageEnergySaved).toBeCloseTo(62.67, 1);
    // Payback months = 2000 / 270.72 = ~7.38 months
    expect(comp.paybackMonths).toBeCloseTo(7.38, 1);
  });

  it('correctly handles increased-cost cases (Appliance B uses more than Appliance A)', () => {
    const smallHeater = { watts: 800, quantity: 1, hoursPerDay: 4 };
    const largeHeater = { watts: 2000, quantity: 1, hoursPerDay: 4 };

    const comp = calculateComparison(smallHeater, largeHeater, {
      electricityRate: 7.5,
      daysInMonth: 30,
      daysInYear: 365,
    });

    // small: 800 * 4 / 1000 = 3.2 kWh/day
    // large: 2000 * 4 / 1000 = 8.0 kWh/day
    // Saved Daily = 3.2 - 8.0 = -4.8 kWh/day
    expect(comp.savedDailyKwh).toBeCloseTo(-4.8, 3);
    expect(comp.savedMonthlyCost).toBeLessThan(0);
    expect(comp.percentageEnergySaved).toBeLessThan(0);
    expect(comp.paybackMonths).toBeNull();
  });

  it('handles empty appliances array in calculateHouseholdTotals gracefully without crashing', () => {
    const result = calculateHouseholdTotals([], {
      electricityRate: 7,
      daysInMonth: 30,
      daysInYear: 365,
    });

    expect(result.totals.dailyKwh).toBe(0);
    expect(result.totals.monthlyKwh).toBe(0);
    expect(result.totals.monthlyCost).toBe(0);
    expect(result.totals.activeAppliancesCount).toBe(0);
    expect(result.items).toHaveLength(0);
  });

  it('accurately calculates decimal wattages, rates, and zero hours/rates', () => {
    const stats = calculateApplianceStats({
      watts: 18.5,
      quantity: 3,
      hoursPerDay: 0,
      electricityRate: 7.85,
      daysInMonth: 30,
      daysInYear: 365,
    });

    expect(stats.dailyKwh).toBe(0);
    expect(stats.monthlyKwh).toBe(0);
    expect(stats.monthlyCost).toBe(0);

    const statsZeroRate = calculateApplianceStats({
      watts: 18.5,
      quantity: 3,
      hoursPerDay: 5.5,
      electricityRate: 0,
      daysInMonth: 30,
      daysInYear: 365,
    });

    // 18.5 * 3 * 5.5 / 1000 = 0.30525 kWh/day
    expect(statsZeroRate.dailyKwh).toBeCloseTo(0.30525, 5);
    expect(statsZeroRate.monthlyCost).toBe(0);
    expect(statsZeroRate.yearlyCost).toBe(0);
  });
});


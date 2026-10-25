import { describe, it, expect } from 'vitest';
import {
  validateWatts,
  validateQuantity,
  validateHours,
  validateRate,
  validateDaysInMonth,
  validateAppliance,
} from './validation';

describe('Validation Utilities', () => {
  it('validates power in watts correctly', () => {
    expect(validateWatts(50).isValid).toBe(true);
    expect(validateWatts(0).isValid).toBe(false);
    expect(validateWatts(-10).isValid).toBe(false);
    expect(validateWatts('').isValid).toBe(false);
    expect(validateWatts('abc').isValid).toBe(false);
    expect(validateWatts(1000000).isValid).toBe(false); // over 100k W
  });

  it('validates quantity as positive integer', () => {
    expect(validateQuantity(1).isValid).toBe(true);
    expect(validateQuantity(5).isValid).toBe(true);
    expect(validateQuantity(0).isValid).toBe(false);
    expect(validateQuantity(-2).isValid).toBe(false);
    expect(validateQuantity(2.5).isValid).toBe(false); // must be integer
    expect(validateQuantity('text').isValid).toBe(false);
  });

  it('validates operating hours between 0 and 24', () => {
    expect(validateHours(0).isValid).toBe(true);
    expect(validateHours(0.5).isValid).toBe(true);
    expect(validateHours(24).isValid).toBe(true);
    expect(validateHours(-0.1).isValid).toBe(false);
    expect(validateHours(24.5).isValid).toBe(false);
    expect(validateHours('').isValid).toBe(false);
  });

  it('validates electricity rate >= 0', () => {
    expect(validateRate(0).isValid).toBe(true); // Free power
    expect(validateRate(7.5).isValid).toBe(true);
    expect(validateRate(-1).isValid).toBe(false);
    expect(validateRate(500).isValid).toBe(false); // Over sanity limit
  });

  it('validates days in month (28, 29, 30, 31)', () => {
    expect(validateDaysInMonth(28).isValid).toBe(true);
    expect(validateDaysInMonth(30).isValid).toBe(true);
    expect(validateDaysInMonth(31).isValid).toBe(true);
    expect(validateDaysInMonth(15).isValid).toBe(false);
  });

  it('validates a complete appliance object and aggregates errors', () => {
    const invalidApp = { watts: -5, quantity: 0, hoursPerDay: 28 };
    const res = validateAppliance(invalidApp);
    expect(res.isValid).toBe(false);
    expect(res.errors.watts).toBeDefined();
    expect(res.errors.quantity).toBeDefined();
    expect(res.errors.hoursPerDay).toBeDefined();

    const validApp = { watts: 75, quantity: 2, hoursPerDay: 8 };
    const validRes = validateAppliance(validApp);
    expect(validRes.isValid).toBe(true);
    expect(Object.keys(validRes.errors).length).toBe(0);
  });
});

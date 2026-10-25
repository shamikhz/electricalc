/**
 * Centralized Validation Utilities for axiscaculator
 * Enforces calculation rules and provides accessible error messages.
 */

/**
 * Validates power in watts.
 * Must be a finite number strictly greater than 0.
 * @param {any} value
 * @returns {{ isValid: boolean, error?: string, sanitizedValue?: number }}
 */
export function validateWatts(value) {
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: 'Power rating is required.' };
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return { isValid: false, error: 'Power must be a valid number.' };
  }
  if (num <= 0) {
    return { isValid: false, error: 'Power rating must be greater than 0 Watts.' };
  }
  if (num > 100000) {
    return { isValid: false, error: 'Power rating exceeds normal household limit (100,000 W).' };
  }
  return { isValid: true, sanitizedValue: num };
}

/**
 * Validates appliance quantity.
 * Must be a positive integer >= 1.
 * @param {any} value
 * @returns {{ isValid: boolean, error?: string, sanitizedValue?: number }}
 */
export function validateQuantity(value) {
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: 'Quantity is required.' };
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return { isValid: false, error: 'Quantity must be a valid number.' };
  }
  if (!Number.isInteger(num)) {
    return { isValid: false, error: 'Quantity must be a whole number (no fractions).' };
  }
  if (num < 1) {
    return { isValid: false, error: 'Quantity must be at least 1 unit.' };
  }
  if (num > 1000) {
    return { isValid: false, error: 'Quantity cannot exceed 1,000 units.' };
  }
  return { isValid: true, sanitizedValue: num };
}

/**
 * Validates operating hours per day.
 * Must be a finite number between 0 and 24 (decimals allowed, e.g. 0.5, 1.5).
 * @param {any} value
 * @returns {{ isValid: boolean, error?: string, sanitizedValue?: number }}
 */
export function validateHours(value) {
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: 'Operating hours are required.' };
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return { isValid: false, error: 'Hours must be a valid number.' };
  }
  if (num < 0) {
    return { isValid: false, error: 'Hours cannot be negative.' };
  }
  if (num > 24) {
    return { isValid: false, error: 'Operating hours cannot exceed 24 hours per day.' };
  }
  return { isValid: true, sanitizedValue: num };
}

/**
 * Validates electricity tariff in ₹/kWh.
 * Must be a finite number >= 0.
 * @param {any} value
 * @returns {{ isValid: boolean, error?: string, sanitizedValue?: number }}
 */
export function validateRate(value) {
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: 'Electricity rate is required.' };
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return { isValid: false, error: 'Tariff rate must be a valid number.' };
  }
  if (num < 0) {
    return { isValid: false, error: 'Electricity rate cannot be negative.' };
  }
  if (num > 200) {
    return { isValid: false, error: 'Tariff rate seems unusually high (max ₹200/unit).' };
  }
  return { isValid: true, sanitizedValue: num };
}

/**
 * Validates days in month duration (28, 30, or 31).
 * @param {any} value
 * @returns {{ isValid: boolean, error?: string, sanitizedValue?: number }}
 */
export function validateDaysInMonth(value) {
  const num = Number(value);
  if (![28, 29, 30, 31].includes(num)) {
    return { isValid: false, error: 'Month duration must be 28, 29, 30, or 31 days.' };
  }
  return { isValid: true, sanitizedValue: num };
}

/**
 * Validates days in year duration (typically 365 or 366).
 * @param {any} value
 * @returns {{ isValid: boolean, error?: string, sanitizedValue?: number }}
 */
export function validateDaysInYear(value) {
  const num = Number(value);
  if (num < 1 || num > 366) {
    return { isValid: false, error: 'Year duration must be between 1 and 366 days.' };
  }
  return { isValid: true, sanitizedValue: num };
}

/**
 * Validates a single appliance object.
 * @param {Object} appliance
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateAppliance(appliance) {
  const errors = {};
  const wattsVal = validateWatts(appliance.watts);
  if (!wattsVal.isValid) errors.watts = wattsVal.error;

  const qtyVal = validateQuantity(appliance.quantity ?? 1);
  if (!qtyVal.isValid) errors.quantity = qtyVal.error;

  const hoursVal = validateHours(appliance.hoursPerDay ?? 0);
  if (!hoursVal.isValid) errors.hoursPerDay = hoursVal.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

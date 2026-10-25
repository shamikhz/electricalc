import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCurrentHouseholdConfig,
  saveCurrentHouseholdConfig,
  getSavedHouseholds,
  saveNamedHousehold,
  deleteNamedHousehold,
  renameNamedHousehold,
  resetHouseholdToDefault,
  isStorageAvailable,
  DEFAULT_HOUSEHOLD_APPLIANCES,
} from './storage';

describe('Storage Management Utilities', () => {
  let mockStorage = {};

  beforeEach(() => {
    mockStorage = {};
    // Mock window.localStorage
    global.window = {
      localStorage: {
        getItem: (key) => mockStorage[key] || null,
        setItem: (key, val) => {
          mockStorage[key] = String(val);
        },
        removeItem: (key) => {
          delete mockStorage[key];
        },
      },
    };
  });

  it('checks storage availability', () => {
    expect(isStorageAvailable()).toBe(true);
  });

  it('returns default household config if nothing is stored', () => {
    const config = getCurrentHouseholdConfig();
    expect(config.appliances.length).toBe(DEFAULT_HOUSEHOLD_APPLIANCES.length);
    expect(config.settings.electricityRate).toBe(7);
  });

  it('persists and retrieves current household configuration', () => {
    const testApps = [
      { id: 't1', applianceSlug: 'ceiling-fan', customName: 'Fan', watts: 50, quantity: 2, hoursPerDay: 8, isEnabled: true },
    ];
    const testSettings = { electricityRate: 8.5, daysInMonth: 31, daysInYear: 365 };

    saveCurrentHouseholdConfig(testApps, testSettings);
    const loaded = getCurrentHouseholdConfig();

    expect(loaded.appliances.length).toBe(1);
    expect(loaded.appliances[0].customName).toBe('Fan');
    expect(loaded.appliances[0].watts).toBe(50);
    expect(loaded.settings.electricityRate).toBe(8.5);
    expect(loaded.settings.daysInMonth).toBe(31);
  });

  it('gracefully handles corrupted or malformed JSON in localStorage', () => {
    mockStorage['axiscaculator_current_config_v1'] = '{ malformed json ::';
    const config = getCurrentHouseholdConfig();
    expect(config.appliances.length).toBe(DEFAULT_HOUSEHOLD_APPLIANCES.length);
  });

  it('saves, renames, and deletes named household configurations', () => {
    const apps = [{ id: '1', watts: 100, quantity: 1, hoursPerDay: 5 }];
    const settings = { electricityRate: 7 };

    // 1. Save
    const saved = saveNamedHousehold('Summer Setup', apps, settings);
    expect(saved.id).toBeDefined();
    expect(saved.name).toBe('Summer Setup');

    let list = getSavedHouseholds();
    expect(list.length).toBe(1);

    // 2. Rename
    renameNamedHousehold(saved.id, 'Summer AC Setup');
    list = getSavedHouseholds();
    expect(list[0].name).toBe('Summer AC Setup');

    // 3. Delete
    deleteNamedHousehold(saved.id);
    list = getSavedHouseholds();
    expect(list.length).toBe(0);
  });

  it('resets household configuration to factory default', () => {
    saveCurrentHouseholdConfig([{ id: 'custom-app', watts: 2000 }], { electricityRate: 12 });
    const reset = resetHouseholdToDefault();
    expect(reset.appliances.length).toBe(DEFAULT_HOUSEHOLD_APPLIANCES.length);
    expect(reset.settings.electricityRate).toBe(7);
  });
});

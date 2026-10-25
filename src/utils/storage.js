/**
 * LocalStorage Management for axiscaculator
 * Handles persistent household configurations, current calculator state, and tariff settings safely.
 * Includes graceful fallbacks when LocalStorage is disabled or corrupt.
 */

const STORAGE_KEYS = {
  CURRENT_CONFIG: 'axiscaculator_current_config_v1',
  SAVED_HOUSEHOLDS: 'axiscaculator_saved_households_v1',
  GLOBAL_SETTINGS: 'axiscaculator_settings_v1',
};

/**
 * Checks if LocalStorage is accessible and functional.
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    const testKey = '__axiscaculator_test_storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Safely reads and parses JSON from LocalStorage.
 * @param {string} key
 * @param {any} fallbackValue
 * @returns {any}
 */
function safeGet(key, fallbackValue) {
  if (!isStorageAvailable()) return fallbackValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallbackValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[axiscaculator] Error reading localStorage key "${key}":`, err);
    return fallbackValue;
  }
}

/**
 * Safely writes JSON data to LocalStorage.
 * @param {string} key
 * @param {any} value
 * @returns {boolean} Success status
 */
function safeSet(key, value) {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[axiscaculator] Error saving to localStorage key "${key}":`, err);
    return false;
  }
}

/**
 * Default initial household state with common Indian appliances.
 */
export const DEFAULT_HOUSEHOLD_APPLIANCES = [
  {
    id: 'item-1',
    applianceSlug: 'ceiling-fan',
    customName: 'Living Room Fans',
    watts: 75,
    quantity: 2,
    hoursPerDay: 12,
    isEnabled: true,
  },
  {
    id: 'item-2',
    applianceSlug: 'refrigerator',
    customName: 'Double Door Refrigerator',
    watts: 180,
    quantity: 1,
    hoursPerDay: 10, // ~10 hours effective compressor run time
    isEnabled: true,
  },
  {
    id: 'item-3',
    applianceSlug: 'air-conditioner',
    customName: '1.5 Ton Inverter AC',
    watts: 1300,
    quantity: 1,
    hoursPerDay: 8,
    isEnabled: true,
  },
  {
    id: 'item-4',
    applianceSlug: 'television',
    customName: '55" LED Smart TV',
    watts: 110,
    quantity: 1,
    hoursPerDay: 5,
    isEnabled: true,
  },
  {
    id: 'item-5',
    applianceSlug: 'led-bulb',
    customName: 'LED Room Bulbs',
    watts: 9,
    quantity: 6,
    hoursPerDay: 6,
    isEnabled: true,
  },
];

export const DEFAULT_SETTINGS = {
  electricityRate: 7, // Standard ₹7/unit
  daysInMonth: 30,
  daysInYear: 365,
};

/**
 * Gets currently active household appliances configuration.
 * @returns {{ appliances: Array, settings: Object }}
 */
export function getCurrentHouseholdConfig() {
  const data = safeGet(STORAGE_KEYS.CURRENT_CONFIG, null);
  if (!data || !Array.isArray(data.appliances) || data.appliances.length === 0) {
    return {
      appliances: DEFAULT_HOUSEHOLD_APPLIANCES,
      settings: DEFAULT_SETTINGS,
    };
  }

  return {
    appliances: data.appliances.map((item, idx) => ({
      id: item.id || `app-${Date.now()}-${idx}`,
      applianceSlug: item.applianceSlug || 'custom',
      customName: item.customName || 'Custom Appliance',
      watts: Number(item.watts) > 0 ? Number(item.watts) : 50,
      quantity: Number(item.quantity) >= 1 ? Math.floor(Number(item.quantity)) : 1,
      hoursPerDay: Number(item.hoursPerDay) >= 0 ? Math.min(24, Number(item.hoursPerDay)) : 1,
      isEnabled: item.isEnabled !== false,
    })),
    settings: {
      electricityRate: Number(data.settings?.electricityRate) >= 0 ? Number(data.settings.electricityRate) : DEFAULT_SETTINGS.electricityRate,
      daysInMonth: [28, 29, 30, 31].includes(Number(data.settings?.daysInMonth)) ? Number(data.settings.daysInMonth) : DEFAULT_SETTINGS.daysInMonth,
      daysInYear: Number(data.settings?.daysInYear) > 0 ? Number(data.settings.daysInYear) : DEFAULT_SETTINGS.daysInYear,
    },
  };
}

/**
 * Saves current household calculation configuration to LocalStorage.
 * @param {Array} appliances
 * @param {Object} settings
 * @returns {boolean}
 */
export function saveCurrentHouseholdConfig(appliances, settings) {
  return safeSet(STORAGE_KEYS.CURRENT_CONFIG, {
    appliances,
    settings,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Gets all saved named households (e.g. "Summer Home", "Office", "2BHK Apartment").
 * @returns {Array<Object>}
 */
export function getSavedHouseholds() {
  const households = safeGet(STORAGE_KEYS.SAVED_HOUSEHOLDS, []);
  if (!Array.isArray(households)) return [];
  return households;
}

/**
 * Saves a new or updated named household configuration.
 * @param {string} name - User provided name
 * @param {Array} appliances
 * @param {Object} settings
 * @param {string} [existingId]
 * @returns {{ id: string, name: string, updatedAt: string }}
 */
export function saveNamedHousehold(name, appliances, settings, existingId = null) {
  const list = getSavedHouseholds();
  const id = existingId || `household-${Date.now()}`;
  const now = new Date().toISOString();

  const entry = {
    id,
    name: name.trim() || 'My Household',
    appliances,
    settings,
    createdAt: existingId ? (list.find((h) => h.id === existingId)?.createdAt || now) : now,
    updatedAt: now,
  };

  const updatedList = existingId
    ? list.map((item) => (item.id === existingId ? entry : item))
    : [entry, ...list];

  safeSet(STORAGE_KEYS.SAVED_HOUSEHOLDS, updatedList);
  return entry;
}

/**
 * Deletes a saved household configuration.
 * @param {string} id
 * @returns {boolean}
 */
export function deleteNamedHousehold(id) {
  const list = getSavedHouseholds();
  const updatedList = list.filter((item) => item.id !== id);
  return safeSet(STORAGE_KEYS.SAVED_HOUSEHOLDS, updatedList);
}

/**
 * Renames a saved household configuration.
 * @param {string} id
 * @param {string} newName
 * @returns {boolean}
 */
export function renameNamedHousehold(id, newName) {
  const list = getSavedHouseholds();
  const updatedList = list.map((item) => {
    if (item.id === id) {
      return { ...item, name: newName.trim() || item.name, updatedAt: new Date().toISOString() };
    }
    return item;
  });
  return safeSet(STORAGE_KEYS.SAVED_HOUSEHOLDS, updatedList);
}

/**
 * Clears current household config and resets to initial defaults.
 * @returns {{ appliances: Array, settings: Object }}
 */
export function resetHouseholdToDefault() {
  const defaultConfig = {
    appliances: DEFAULT_HOUSEHOLD_APPLIANCES,
    settings: DEFAULT_SETTINGS,
  };
  saveCurrentHouseholdConfig(defaultConfig.appliances, defaultConfig.settings);
  return defaultConfig;
}

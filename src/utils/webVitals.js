/**
 * Core Web Vitals RUM (Real User Monitoring) Observer
 * Tracks LCP, INP, CLS, FCP, and TTFB using standard browser PerformanceObserver API.
 * Stores telemetry in window.__CWV_METRICS__ for audits and monitoring.
 */

const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  INP: { good: 200, needsImprovement: 500 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

function getRating(metricName, value) {
  const t = THRESHOLDS[metricName];
  if (!t) return 'good';
  if (value <= t.good) return 'good';
  if (value <= t.needsImprovement) return 'needs-improvement';
  return 'poor';
}

export function initWebVitals() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  window.__CWV_METRICS__ = window.__CWV_METRICS__ || {
    LCP: null,
    INP: null,
    CLS: { value: 0, rating: 'good' },
    FCP: null,
    TTFB: null,
    history: [],
  };

  const recordMetric = (name, rawValue, extra = {}) => {
    const value = typeof rawValue === 'number' ? Math.round(rawValue * 100) / 100 : rawValue;
    const rating = getRating(name, value);
    const metricObj = { name, value, rating, timestamp: Date.now(), ...extra };

    window.__CWV_METRICS__[name] = metricObj;
    window.__CWV_METRICS__.history.push(metricObj);

    if (import.meta.env.DEV) {
      const color = rating === 'good' ? '#10b981' : rating === 'needs-improvement' ? '#f59e0b' : '#ef4444';
      console.debug(
        `%c[CWV] ${name}: ${value}${name === 'CLS' ? '' : 'ms'} (${rating})`,
        `color: ${color}; font-weight: bold;`
      );
    }
  };

  // 1. TTFB (Time to First Byte)
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
      const nav = navEntries[0];
      const ttfb = nav.responseStart || 0;
      recordMetric('TTFB', ttfb);
    }
  } catch {
    // Graceful fallback
  }

  // 2. FCP (First Contentful Paint)
  try {
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          recordMetric('FCP', entry.startTime);
          paintObserver.disconnect();
          break;
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
  } catch {
    // Ignore unsupported browser
  }

  // 3. LCP (Largest Contentful Paint)
  try {
    let largestLcp = 0;
    const lcpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.startTime > largestLcp) {
          largestLcp = entry.startTime;
          recordMetric('LCP', entry.startTime, {
            element: entry.element ? entry.element.tagName : null,
            size: entry.size,
          });
        }
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Disconnect LCP observer on first user interaction as per Web Vitals spec
    const stopLcp = () => {
      lcpObserver.takeRecords();
      lcpObserver.disconnect();
      ['keydown', 'pointerdown'].forEach((evt) =>
        window.removeEventListener(evt, stopLcp, { capture: true })
      );
    };
    ['keydown', 'pointerdown'].forEach((evt) =>
      window.addEventListener(evt, stopLcp, { capture: true, once: true })
    );
  } catch {
    // Ignore unsupported browser
  }

  // 4. CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Only count layout shifts that had no recent user input (within 500ms)
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          recordMetric('CLS', clsValue);
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch {
    // Ignore unsupported browser
  }

  // 5. INP (Interaction to Next Paint) / FID
  try {
    let longestInteraction = 0;
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const duration = entry.duration || (entry.processingEnd - entry.startTime) || 0;
        if (duration > longestInteraction) {
          longestInteraction = duration;
          recordMetric('INP', duration, {
            interactionType: entry.name,
            target: entry.target ? entry.target.tagName : null,
          });
        }
      }
    });
    // Try modern 'event' entryType first, fallback to 'first-input'
    try {
      inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch {
      inpObserver.observe({ type: 'first-input', buffered: true });
    }
  } catch {
    // Ignore unsupported browser
  }
}

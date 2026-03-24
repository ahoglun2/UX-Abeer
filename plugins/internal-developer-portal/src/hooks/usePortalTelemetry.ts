import { useMemo, useRef } from 'react';

type TelemetryEvent = {
  id: string;
  name: string;
  at: string;
  payload: Record<string, string | number | boolean>;
};

const TELEMETRY_KEY = 'idp.telemetry.v1';

const hasStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const readEvents = (): TelemetryEvent[] => {
  if (!hasStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(TELEMETRY_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeEvents = (events: TelemetryEvent[]) => {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.setItem(TELEMETRY_KEY, JSON.stringify(events.slice(-200)));
};

const pushEvent = (event: TelemetryEvent) => {
  const events = [...readEvents(), event];
  writeEvents(events);
};

export const usePortalTelemetry = () => {
  const sessionStart = useRef(Date.now());
  const firstFindRecorded = useRef(false);

  const trackEvent = (name: string, payload: Record<string, string | number | boolean>) => {
    pushEvent({
      id: `${name}-${Date.now()}`,
      name,
      at: new Date().toISOString(),
      payload,
    });
  };

  const trackSearch = (query: string) => {
    trackEvent('search_used', { queryLength: query.length });
  };

  const trackNavigation = (source: string, target: string) => {
    const elapsedMs = Date.now() - sessionStart.current;

    trackEvent('navigation_click', {
      source,
      target,
      elapsedMs,
      under30s: elapsedMs <= 30000,
    });

    if (!firstFindRecorded.current) {
      firstFindRecorded.current = true;
      trackEvent('first_find', {
        source,
        target,
        elapsedMs,
        under30s: elapsedMs <= 30000,
      });
    }
  };

  const metrics = useMemo(() => {
    const events = readEvents().filter(event => event.name === 'first_find');
    const elapsed = events
      .map(event => Number(event.payload.elapsedMs || 0))
      .filter(value => Number.isFinite(value) && value > 0);

    if (elapsed.length === 0) {
      return {
        averageFirstFindMs: 0,
        under30Rate: 0,
      };
    }

    const total = elapsed.reduce((sum, value) => sum + value, 0);
    const under30 = elapsed.filter(value => value <= 30000).length;

    return {
      averageFirstFindMs: Math.round(total / elapsed.length),
      under30Rate: Math.round((under30 / elapsed.length) * 100),
    };
  }, []);

  return {
    trackEvent,
    trackNavigation,
    trackSearch,
    metrics,
  };
};

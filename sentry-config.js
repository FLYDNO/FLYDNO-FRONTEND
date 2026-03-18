// FlyDeals — Sentry Error Tracking Configuration
// Shared across all pages
// Docs: https://docs.sentry.io/platforms/javascript/

// Replace with your actual Sentry DSN from sentry.io
const SENTRY_DSN = 'https://39578fccf59451375846b169673ecdb5@o4511066279641088.ingest.de.sentry.io/4511066295697488';

function initSentry() {
  if (!window.Sentry || SENTRY_DSN === 'YOUR_SENTRY_DSN_HERE') {
    if (SENTRY_DSN === 'YOUR_SENTRY_DSN_HERE') {
      console.warn('FlyDeals: Sentry DSN ikke konfigurert. Oppdater SENTRY_DSN i sentry-config.js');
    }
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: window.location.hostname === 'localhost' || window.location.protocol === 'file:' ? 'development' : 'production',
    release: 'flydeals@1.0.0',
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration()
    ],
    beforeSend(event) {
      // Don't send events in development
      if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
        console.log('[Sentry dev]', event);
        return null;
      }
      return event;
    }
  });
}

// Set user context after auth (call from pages after login)
function setSentryUser(user) {
  if (!window.Sentry || SENTRY_DSN === 'YOUR_SENTRY_DSN_HERE') return;
  if (user) {
    Sentry.setUser({ id: user.id, email: user.email });
  } else {
    Sentry.setUser(null);
  }
}

initSentry();

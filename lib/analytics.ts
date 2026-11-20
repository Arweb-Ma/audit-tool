/**
 * Minimal funnel tracking. Sends to whichever provider is loaded (GA4 via gtag,
 * Plausible) and always pushes to window.dataLayer (GTM-compatible).
 * No-op on the server and when nothing is configured.
 */
export type FunnelEvent =
  | 'audit_started'
  | 'audit_completed'
  | 'audit_failed'
  | 'lead_modal_opened'
  | 'lead_submitted'
  | 'lead_failed'
  | 'whatsapp_clicked'
  | 'email_clicked';

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: Props }) => void;
  }
}

export function track(event: FunnelEvent, props: Props = {}): void {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props });
    window.gtag?.('event', event, props);
    window.plausible?.(event, { props });
  } catch {
    /* analytics must never break the app */
  }
}

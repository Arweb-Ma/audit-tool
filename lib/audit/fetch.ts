import { config } from '../config';
import { assertSafeDestination, createPinnedIpAgent, normalizeTargetUrl, SsrfBlockError } from './url';
import { logger } from '../logger';

export interface SafeFetchOptions {
  method?: 'GET' | 'HEAD' | 'POST';
  headers?: Record<string, string> | Headers;
  timeoutMs?: number;
  maxRedirects?: number;
  maxBytes?: number;
  allowedContentTypes?: string[];
  body?: string | Uint8Array;
}

export interface SafeFetchResponse {
  status: number;
  statusText: string;
  ok: boolean;
  finalUrl: string;
  headers: Headers;
  ttfbMs: number;
  isRedirected: boolean;
  redirectChainCount: number;
  text(): Promise<string>;
  buffer(): Promise<Uint8Array>;
}

export interface SafeFetchResult {
  html: string;
  status: number;
  finalUrl: string;
  ttfbMs: number;
  headers: Headers;
  isRedirected: boolean;
  redirectChainCount: number;
}

/**
 * Reusable, security-hardened fetch helper that prevents SSRF and DNS rebinding (TOCTOU):
 * 1. Validates destination IP safety before every request hop.
 * 2. Pins socket connection directly to the pre-validated safe IP via Undici Agent dispatcher.
 * 3. Inspects redirects manually (redirect: 'manual') to prevent 301/302 redirects to internal/metadata IPs.
 * 4. Caps maximum received bytes to prevent memory exhaustion / denial of service.
 * 5. Strictly bounds execution with AbortController timeout.
 */
export async function safeFetch(
  target: URL | string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResponse> {
  let currentUrl = typeof target === 'string' ? normalizeTargetUrl(target) : target;
  let redirectCount = 0;
  const maxRedirects = options.maxRedirects ?? config.audit.maxRedirectHops;
  const timeoutMs = options.timeoutMs ?? config.audit.fetchTimeoutMs;
  const maxBytes = options.maxBytes ?? config.audit.maxResponseBodyBytes;
  const method = options.method || 'GET';

  let ttfbMs = 0;

  while (redirectCount <= maxRedirects) {
    // 1. SSRF pre-flight validation before every request hop (returns validated safe IP)
    const pinnedIp = await assertSafeDestination(currentUrl);

    // 2. Pin the socket connection directly to the validated IP to defeat DNS rebinding (TOCTOU)
    const agent = createPinnedIpAgent(pinnedIp);

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), timeoutMs);
    const startHopTime = performance.now();

    try {
      logger.info('Executing safeFetch hop', {
        url: currentUrl.href,
        hop: redirectCount,
        pinnedIp,
        method,
      });

      const response = await fetch(currentUrl.href, {
        method,
        redirect: 'manual', // Never follow redirects blindly; inspect each destination
        signal: controller.signal,
        headers: options.headers || {
          'User-Agent': config.audit.userAgent,
          Accept: '*/*',
        },
        dispatcher: agent,
      } as RequestInit & { dispatcher?: any });

      clearTimeout(timeoutTimer);
      const hopDuration = Math.round(performance.now() - startHopTime);
      if (redirectCount === 0) {
        ttfbMs = hopDuration;
      }

      // Handle redirect status codes (301, 302, 303, 307, 308)
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        agent.destroy().catch(() => {});

        const location = response.headers.get('location');
        if (!location) {
          throw new Error(`Redirection HTTP ${response.status} reçue sans en-tête Location.`);
        }

        redirectCount++;
        if (redirectCount > maxRedirects) {
          throw new Error(`Trop de redirections successives détectées (limite de ${maxRedirects} dépassée).`);
        }

        const nextUrl = new URL(location, currentUrl);
        currentUrl = normalizeTargetUrl(nextUrl.href);
        continue; // Next hop re-runs assertSafeDestination and pins to new IP
      }

      // Validate Content-Type if restriction specified
      if (options.allowedContentTypes && options.allowedContentTypes.length > 0) {
        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        const matches = options.allowedContentTypes.some((ct) => contentType.includes(ct.toLowerCase()));
        if (!matches) {
          agent.destroy().catch(() => {});
          throw new Error(
            `Le type de contenu renvoyé (${contentType || 'inconnu'}) n'est pas autorisé (${options.allowedContentTypes.join(', ')}).`
          );
        }
      }

      // Stream body up to maxBytes limit
      let bodyBuffer = new Uint8Array(0);

      if (method !== 'HEAD' && response.body) {
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let receivedBytes = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            receivedBytes += value.length;
            if (receivedBytes > maxBytes) {
              reader.cancel().catch(() => {});
              logger.warn('Response body truncated due to max size limit', {
                url: currentUrl.href,
                receivedBytes,
                maxBytes,
              });
              break;
            }
            chunks.push(value);
          }
        }

        // Concatenate chunks into a single Uint8Array
        bodyBuffer = new Uint8Array(receivedBytes);
        let offset = 0;
        for (const chunk of chunks) {
          bodyBuffer.set(chunk, offset);
          offset += chunk.length;
        }
      }

      agent.destroy().catch(() => {});

      let cachedText: string | null = null;

      return {
        status: response.status,
        statusText: response.statusText,
        ok: response.status >= 200 && response.status < 300,
        finalUrl: currentUrl.href,
        headers: response.headers,
        ttfbMs,
        isRedirected: redirectCount > 0,
        redirectChainCount: redirectCount,
        async buffer() {
          return bodyBuffer;
        },
        async text() {
          if (cachedText === null) {
            cachedText = new TextDecoder('utf-8').decode(bodyBuffer);
          }
          return cachedText;
        },
      };
    } catch (err: any) {
      clearTimeout(timeoutTimer);
      agent.destroy().catch(() => {});

      if (err.name === 'AbortError') {
        throw new Error(`Délai d'attente dépassé (${timeoutMs / 1000}s) lors de la tentative de connexion au site.`);
      }
      if (err instanceof SsrfBlockError) {
        throw err;
      }
      throw err;
    }
  }

  throw new Error('Impossible d\'obtenir une réponse du site web cible.');
}

/**
 * High-level helper for fetching target website HTML for full audit analysis.
 */
export async function safeFetchTargetHtml(initialUrl: URL): Promise<SafeFetchResult> {
  const res = await safeFetch(initialUrl, {
    method: 'GET',
    headers: {
      'User-Agent': config.audit.userAgent,
      Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1',
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8,ar;q=0.7',
      'Cache-Control': 'no-cache',
    },
    allowedContentTypes: ['text/html', 'application/xhtml+xml', 'text/plain'],
    maxBytes: config.audit.maxResponseBodyBytes,
    timeoutMs: config.audit.fetchTimeoutMs,
  });

  const html = await res.text();

  return {
    html,
    status: res.status,
    finalUrl: res.finalUrl,
    ttfbMs: res.ttfbMs,
    headers: res.headers,
    isRedirected: res.isRedirected,
    redirectChainCount: res.redirectChainCount,
  };
}

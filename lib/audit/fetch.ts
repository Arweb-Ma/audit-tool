import { config } from '../config';
import { assertSafeDestination, normalizeTargetUrl, SsrfBlockError } from './url';
import { logger } from '../logger';

export interface SafeFetchResult {
  html: string;
  status: number;
  finalUrl: string;
  ttfbMs: number;
  headers: Headers;
  isRedirected: boolean;
  redirectChainCount: number;
}

export async function safeFetchTargetHtml(initialUrl: URL): Promise<SafeFetchResult> {
  let currentUrl = initialUrl;
  let redirectCount = 0;
  const maxRedirects = config.audit.maxRedirectHops;
  const timeoutMs = config.audit.fetchTimeoutMs;
  const maxBytes = config.audit.maxResponseBodyBytes;

  let finalHeaders: Headers | null = null;
  let finalStatus = 0;
  let ttfbMs = 0;

  while (redirectCount <= maxRedirects) {
    // 1. SSRF pre-flight check before every request hop
    await assertSafeDestination(currentUrl);

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), timeoutMs);
    const startHopTime = performance.now();

    try {
      logger.info('Fetching audit target hop', {
        url: currentUrl.href,
        hop: redirectCount,
      });

      const response = await fetch(currentUrl.href, {
        method: 'GET',
        redirect: 'manual', // We inspect each redirect destination ourselves to prevent SSRF via 301/302
        signal: controller.signal,
        headers: {
          'User-Agent': config.audit.userAgent,
          Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8,ar;q=0.7',
          'Cache-Control': 'no-cache',
        },
      });

      clearTimeout(timeoutTimer);
      const hopDuration = Math.round(performance.now() - startHopTime);
      if (redirectCount === 0) {
        ttfbMs = hopDuration;
      }

      finalStatus = response.status;
      finalHeaders = response.headers;

      // Handle redirect (301, 302, 303, 307, 308)
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) {
          throw new Error(`Redirection HTTP ${response.status} reçue sans en-tête Location.`);
        }

        redirectCount++;
        if (redirectCount > maxRedirects) {
          throw new Error('Trop de redirections successives détectées (limite de 3 dépassée).');
        }

        const nextUrl = new URL(location, currentUrl);
        currentUrl = normalizeTargetUrl(nextUrl.href);
        continue;
      }

      // Check Content-Type
      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      if (
        !contentType.includes('text/html') &&
        !contentType.includes('application/xhtml+xml') &&
        !contentType.includes('text/plain')
      ) {
        throw new Error(
          `Le contenu renvoyé (${contentType || 'inconnu'}) n'est pas une page HTML analysable.`
        );
      }

      // Stream body up to maxBytes to avoid memory exhaustion
      if (!response.body) {
        return {
          html: '',
          status: finalStatus,
          finalUrl: currentUrl.href,
          ttfbMs,
          headers: finalHeaders,
          isRedirected: redirectCount > 0,
          redirectChainCount: redirectCount,
        };
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          receivedBytes += value.length;
          if (receivedBytes > maxBytes) {
            reader.cancel();
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

      const decoder = new TextDecoder('utf-8');
      let html = '';
      for (const chunk of chunks) {
        html += decoder.decode(chunk, { stream: true });
      }
      html += decoder.decode();

      return {
        html,
        status: finalStatus,
        finalUrl: currentUrl.href,
        ttfbMs,
        headers: finalHeaders,
        isRedirected: redirectCount > 0,
        redirectChainCount: redirectCount,
      };
    } catch (err: any) {
      clearTimeout(timeoutTimer);
      if (err.name === 'AbortError') {
        throw new Error(`Délai d'attente dépassé (${timeoutMs / 1000}s) lors de la tentative de connexion au site.`);
      }
      if (err instanceof SsrfBlockError) {
        throw err;
      }
      throw err;
    }
  }

  throw new Error('Impossible d\'obtenir le contenu HTML du site.');
}

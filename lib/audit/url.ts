import dns from 'node:dns/promises';
import net from 'node:net';

export class SsrfBlockError extends Error {
  constructor(message: string, public readonly code: string = 'SSRF_BLOCKED') {
    super(message);
    this.name = 'SsrfBlockError';
  }
}

/**
 * Normalizes input URL strings, forcing http/https and validating hostname.
 */
export function normalizeTargetUrl(input: string): URL {
  let trimmed = (input || '').trim();
  if (!trimmed) {
    throw new Error('Une adresse URL de site web est requise.');
  }

  // If another explicit protocol is specified, block it
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(trimmed) && !/^https?:\/\//i.test(trimmed)) {
    throw new SsrfBlockError('Seuls les protocoles HTTP et HTTPS sont autorisés.');
  }

  // Prepend https:// if protocol is missing
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Le format de l\'URL est invalide.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new SsrfBlockError('Seuls les protocoles HTTP et HTTPS sont autorisés.');
  }

  if (!parsed.hostname || parsed.hostname.includes('..')) {
    throw new Error('Le nom d\'hôte du site est invalide.');
  }

  return parsed;
}

/**
 * Checks whether an IPv4 address falls within private/reserved/loopback/cloud ranges.
 */
function isPrivateOrReservedIPv4(ip: string): boolean {
  const parts = ip.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((n) => isNaN(n) || n < 0 || n > 255)) {
    return true; // Malformed is unsafe
  }

  const [a, b, c, d] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;

  // 10.0.0.0/8 (Private)
  if (a === 10) return true;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 100.64.0.0/10 (Carrier-grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;

  // 169.254.0.0/16 (Link-local & AWS/GCP/Azure Metadata 169.254.169.254)
  if (a === 169 && b === 254) return true;

  // 172.16.0.0/12 (Private)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.0.0.0/24, 192.0.2.0/24 (Documentation / reserved)
  if (a === 192 && b === 0 && (c === 0 || c === 2)) return true;

  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;

  // 198.18.0.0/15 (Benchmarking)
  if (a === 198 && (b === 18 || b === 19)) return true;

  // 198.51.100.0/24, 203.0.113.0/24 (TEST-NET)
  if ((a === 198 && b === 51 && c === 100) || (a === 203 && b === 0 && c === 113)) return true;

  // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
  if (a >= 224) return true;

  // Broadcast
  if (a === 255 && b === 255 && c === 255 && d === 255) return true;

  return false;
}

/**
 * Checks whether an IPv6 address falls within private/loopback/link-local/multicast ranges.
 */
function isPrivateOrReservedIPv6(ip: string): boolean {
  const clean = ip.toLowerCase().trim();

  // ::1 / :: (Loopback & unspecified)
  if (clean === '::1' || clean === '::') return true;

  // Unique local fc00::/7 (fc00: to fdff:)
  if (clean.startsWith('fc') || clean.startsWith('fd')) return true;

  // Link-local fe80::/10
  if (clean.startsWith('fe8') || clean.startsWith('fe9') || clean.startsWith('fea') || clean.startsWith('feb')) return true;

  // Multicast ff00::/8
  if (clean.startsWith('ff')) return true;

  // IPv4-mapped IPv6 ::ffff:192.168.1.1
  if (clean.includes('::ffff:')) {
    const v4Part = clean.split('::ffff:')[1];
    if (v4Part && net.isIPv4(v4Part)) {
      return isPrivateOrReservedIPv4(v4Part);
    }
    return true;
  }

  return false;
}

export function isIpAddressSafe(ip: string): boolean {
  const version = net.isIP(ip);
  if (version === 4) {
    return !isPrivateOrReservedIPv4(ip);
  }
  if (version === 6) {
    return !isPrivateOrReservedIPv6(ip);
  }
  return false;
}

/**
 * Validates destination hostname via pre-flight DNS lookup to prevent SSRF.
 */
export async function assertSafeDestination(url: URL): Promise<string> {
  const hostname = url.hostname.toLowerCase();

  // Block obvious internal names immediately
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.home') ||
    hostname === 'metadata.google.internal' ||
    hostname === 'instance-data'
  ) {
    throw new SsrfBlockError(`Accès refusé : l'hôte "${hostname}" est une adresse interne ou privée.`);
  }

  // If hostname is directly an IP address
  if (net.isIP(hostname)) {
    if (!isIpAddressSafe(hostname)) {
      throw new SsrfBlockError(`Accès refusé : l'adresse IP "${hostname}" est réservée ou privée.`);
    }
    return hostname;
  }

  // Resolve hostname through DNS
  let lookupResults: Array<{ address: string; family: number }>;
  try {
    lookupResults = await dns.lookup(hostname, { all: true, verbatim: true });
  } catch (err: any) {
    throw new Error(`Impossible de résoudre l'adresse DNS du domaine "${hostname}". Vérifiez que le domaine existe.`);
  }

  if (!lookupResults || lookupResults.length === 0) {
    throw new Error(`Aucune adresse IP trouvée pour "${hostname}".`);
  }

  // Validate every resolved IP
  for (const entry of lookupResults) {
    if (!isIpAddressSafe(entry.address)) {
      throw new SsrfBlockError(
        `Accès refusé : le domaine "${hostname}" résout vers une adresse IP protégée ou privée (${entry.address}).`
      );
    }
  }

  return lookupResults[0].address;
}

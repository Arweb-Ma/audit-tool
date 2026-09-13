import { config } from '../config';
import { CoreWebVitals, MetricItem } from '../../types/audit';
import { logger } from '../logger';

function getLcpStatus(seconds: number): MetricItem['status'] {
  if (seconds <= 2.5) return 'good';
  if (seconds <= 4.0) return 'needs-improvement';
  return 'poor';
}

function getClsStatus(score: number): MetricItem['status'] {
  if (score <= 0.1) return 'good';
  if (score <= 0.25) return 'needs-improvement';
  return 'poor';
}

function getFcpStatus(seconds: number): MetricItem['status'] {
  if (seconds <= 1.8) return 'good';
  if (seconds <= 3.0) return 'needs-improvement';
  return 'poor';
}

function getSpeedIndexStatus(seconds: number): MetricItem['status'] {
  if (seconds <= 3.4) return 'good';
  if (seconds <= 5.8) return 'needs-improvement';
  return 'poor';
}

function getTtfbStatus(ms: number): MetricItem['status'] {
  if (ms <= 800) return 'good';
  if (ms <= 1800) return 'needs-improvement';
  return 'poor';
}

export async function fetchRealPageSpeedMetrics(
  targetUrl: string,
  directTtfbMs: number,
  mobileFriendlyByViewport: boolean
): Promise<CoreWebVitals> {
  const apiKey = config.audit.pagespeedApiKey;
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    targetUrl
  )}&strategy=mobile${apiKey ? `&key=${apiKey}` : ''}`;

  const defaultUnavailable: CoreWebVitals = {
    available: false,
    source: 'unavailable',
    fieldDataAvailable: false,
    mobileFriendly: mobileFriendlyByViewport,
    directTtfbMs,
    note: 'Mesures PageSpeed indisponibles (API non configurée ou limite de requêtes atteinte).',
    lcp: {
      value: 'Non mesuré',
      status: 'unavailable',
      label: 'Largest Contentful Paint (LCP)',
      target: '≤ 2.5s',
      description: 'Mesure le temps nécessaire pour afficher le bloc visuel principal.',
    },
    cls: {
      value: 'Non mesuré',
      status: 'unavailable',
      label: 'Cumulative Layout Shift (CLS)',
      target: '≤ 0.1',
      description: 'Mesure la stabilité visuelle pendant le chargement.',
    },
    fcp: {
      value: 'Non mesuré',
      status: 'unavailable',
      label: 'First Contentful Paint (FCP)',
      target: '≤ 1.8s',
      description: 'Temps d\'apparition du premier élément de texte ou d\'image.',
    },
    speedIndex: {
      value: 'Non mesuré',
      status: 'unavailable',
      label: 'Speed Index',
      target: '≤ 3.4s',
      description: 'Rapidité avec laquelle le contenu devient visible.',
    },
    ttfb: {
      value: `${directTtfbMs} ms`,
      numVal: directTtfbMs,
      status: getTtfbStatus(directTtfbMs),
      label: 'Temps de premier octet direct (TTFB)',
      target: '≤ 800 ms',
      description: 'Mesure directe du temps de réponse initial du serveur.',
    },
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timer);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      logger.warn('PageSpeed API returned non-200 status', {
        status: res.status,
        error: errText.slice(0, 300),
        url: targetUrl,
      });

      if (res.status === 429) {
        defaultUnavailable.note = 'Le quota de requêtes Google PageSpeed a été atteint. Les données TTFB serveur restent fiables.';
      } else if (res.status === 400 || res.status === 500) {
        defaultUnavailable.note = `Google PageSpeed n'a pas pu analyser cette page (${res.status}). Vérifiez que le site est publiquement accessible sans protection anti-bot stricte.`;
      }
      return defaultUnavailable;
    }

    const data = await res.json();
    const audits = data?.lighthouseResult?.audits;

    if (!audits) {
      return defaultUnavailable;
    }

    // Lab data extraction
    const lcpAudit = audits['largest-contentful-paint'];
    const clsAudit = audits['cumulative-layout-shift'];
    const fcpAudit = audits['first-contentful-paint'];
    const siAudit = audits['speed-index'];
    const ttfbAudit = audits['server-response-time'];

    const lcpSec = lcpAudit?.numericValue ? parseFloat((lcpAudit.numericValue / 1000).toFixed(2)) : undefined;
    const clsVal = clsAudit?.numericValue !== undefined ? parseFloat(clsAudit.numericValue.toFixed(3)) : undefined;
    const fcpSec = fcpAudit?.numericValue ? parseFloat((fcpAudit.numericValue / 1000).toFixed(2)) : undefined;
    const siSec = siAudit?.numericValue ? parseFloat((siAudit.numericValue / 1000).toFixed(2)) : undefined;
    const ttfbNumMs = ttfbAudit?.numericValue ? Math.round(ttfbAudit.numericValue) : directTtfbMs;

    // Check if Chrome User Experience Report (CrUX) field data exists
    const fieldExperience = data?.loadingExperience;
    const fieldDataAvailable = fieldExperience?.metrics !== undefined && Object.keys(fieldExperience.metrics).length > 0;

    return {
      available: true,
      source: 'lighthouse-lab',
      fieldDataAvailable,
      directTtfbMs,
      mobileFriendly: mobileFriendlyByViewport,
      note: fieldDataAvailable
        ? 'Données de laboratoire Lighthouse (Mobile) complétées par les métriques réelles CrUX.'
        : 'Données de laboratoire Lighthouse simulées sur connexion mobile 4G.',
      lcp: {
        value: lcpSec !== undefined ? `${lcpSec} s` : 'N/D',
        numVal: lcpSec,
        status: lcpSec !== undefined ? getLcpStatus(lcpSec) : 'unavailable',
        label: 'Largest Contentful Paint (LCP)',
        target: '≤ 2.5s',
        description: 'Mesure le temps nécessaire pour afficher le contenu visuel principal.',
      },
      cls: {
        value: clsVal !== undefined ? `${clsVal}` : 'N/D',
        numVal: clsVal,
        status: clsVal !== undefined ? getClsStatus(clsVal) : 'unavailable',
        label: 'Cumulative Layout Shift (CLS)',
        target: '≤ 0.1',
        description: 'Quantifie les décalages visuels inattendus durant le rendu.',
      },
      fcp: {
        value: fcpSec !== undefined ? `${fcpSec} s` : 'N/D',
        numVal: fcpSec,
        status: fcpSec !== undefined ? getFcpStatus(fcpSec) : 'unavailable',
        label: 'First Contentful Paint (FCP)',
        target: '≤ 1.8s',
        description: 'Temps jusqu\'à l\'apparition du premier élément textuel ou graphique.',
      },
      speedIndex: {
        value: siSec !== undefined ? `${siSec} s` : 'N/D',
        numVal: siSec,
        status: siSec !== undefined ? getSpeedIndexStatus(siSec) : 'unavailable',
        label: 'Speed Index',
        target: '≤ 3.4s',
        description: 'Vitesse à laquelle les parties visibles de la page sont complétées.',
      },
      ttfb: {
        value: `${ttfbNumMs} ms`,
        numVal: ttfbNumMs,
        status: getTtfbStatus(ttfbNumMs),
        label: 'Temps de premier octet (TTFB)',
        target: '≤ 800 ms',
        description: 'Temps de réponse initial du serveur avant le début du téléchargement.',
      },
    };
  } catch (err) {
    logger.warn('Error fetching PageSpeed metrics', { error: String(err), url: targetUrl });
    return defaultUnavailable;
  }
}

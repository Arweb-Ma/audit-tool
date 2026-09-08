import * as cheerio from 'cheerio';
import { SeoMetrics } from '../../types/audit';

export function analyzeSeo(html: string, baseUrl: URL): SeoMetrics {
  const $ = cheerio.load(html || '<html><head></head><body></body></html>');

  // Title
  const titleEl = $('title').first();
  const titleText = titleEl.text().trim();
  const titleLength = titleText.length;
  const hasTitle = titleLength > 0;
  let titleStatus: SeoMetrics['titleStatus'] = 'poor';
  if (hasTitle) {
    if (titleLength >= 30 && titleLength <= 65) {
      titleStatus = 'good';
    } else {
      titleStatus = 'warning'; // Length is slightly sub-optimal but title exists
    }
  }

  // Meta description
  const metaDescEl = $('meta[name="description" i], meta[name="Description" i]').first();
  const metaDescriptionText = (metaDescEl.attr('content') || '').trim();
  const metaDescriptionLength = metaDescriptionText.length;
  const hasMetaDescription = metaDescriptionLength > 0;
  let metaDescriptionStatus: SeoMetrics['metaDescriptionStatus'] = 'poor';
  if (hasMetaDescription) {
    if (metaDescriptionLength >= 70 && metaDescriptionLength <= 165) {
      metaDescriptionStatus = 'good';
    } else {
      metaDescriptionStatus = 'warning';
    }
  }

  // Headings
  const h1Elements = $('h1');
  const h1Count = h1Elements.length;
  const h1Text = h1Elements.first().text().trim();
  const h2Count = $('h2').length;
  // Basic hierarchy check: having H2s with zero H1 is problematic
  const headingHierarchyValid = h1Count === 1;

  // Viewport & language
  const viewportMeta = $('meta[name="viewport" i]').first();
  const viewportContent = (viewportMeta.attr('content') || '').trim();
  const hasViewport = viewportContent.includes('width=device-width');

  const htmlLang = ($('html').attr('lang') || '').trim();
  const hasHtmlLang = htmlLang.length > 0;

  // Favicon
  const faviconEl = $('link[rel*="icon" i]').first();
  const hasFavicon = Boolean(faviconEl.attr('href'));

  // Image analysis
  const imgElements = $('img');
  const totalImages = imgElements.length;
  let imagesMissingAlt = 0;
  let imagesWithEmptyAlt = 0;
  let imagesMissingDimensions = 0;
  let imagesLazyLoaded = 0;

  imgElements.each((_, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined) {
      imagesMissingAlt++;
    } else if (alt.trim() === '') {
      imagesWithEmptyAlt++;
    }

    const width = $(el).attr('width');
    const height = $(el).attr('height');
    if (!width || !height) {
      imagesMissingDimensions++;
    }

    const loading = $(el).attr('loading');
    if (loading === 'lazy') {
      imagesLazyLoaded++;
    }
  });

  const imagesWithExplicitAlt = totalImages - imagesMissingAlt;
  const imagesPercentWithAlt = totalImages > 0 ? Math.round((imagesWithExplicitAlt / totalImages) * 100) : 100;

  // Link analysis
  const aElements = $('a[href]');
  const totalLinks = aElements.length;
  let internalLinks = 0;
  let externalLinks = 0;
  let emptyAnchorLinks = 0;
  let externalLinksWithoutNoopener = 0;

  aElements.each((_, el) => {
    const href = ($(el).attr('href') || '').trim();
    if (!href || href === '#' || href.startsWith('javascript:')) {
      emptyAnchorLinks++;
      return;
    }

    try {
      const linkUrl = new URL(href, baseUrl.href);
      if (linkUrl.hostname === baseUrl.hostname) {
        internalLinks++;
      } else {
        externalLinks++;
        const target = $(el).attr('target');
        const rel = $(el).attr('rel') || '';
        if (target === '_blank' && !rel.includes('noopener') && !rel.includes('noreferrer')) {
          externalLinksWithoutNoopener++;
        }
      }
    } catch {
      // Relative or special anchor
      internalLinks++;
    }
  });

  return {
    hasTitle,
    titleText,
    titleLength,
    titleStatus,
    hasMetaDescription,
    metaDescriptionText,
    metaDescriptionLength,
    metaDescriptionStatus,
    h1Count,
    h1Text,
    h2Count,
    headingHierarchyValid,
    hasViewport,
    viewportContent,
    htmlLang,
    hasHtmlLang,
    hasFavicon,
    totalImages,
    imagesMissingAlt,
    imagesWithEmptyAlt,
    imagesPercentWithAlt,
    imagesMissingDimensions,
    imagesLazyLoaded,
    totalLinks,
    internalLinks,
    externalLinks,
    emptyAnchorLinks,
    externalLinksWithoutNoopener,
  };
}

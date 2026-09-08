import {
  AuditIssue,
  CoreWebVitals,
  IndexabilityMetrics,
  SchemaMetrics,
  SecurityMetrics,
  SeoMetrics,
  SocialMetrics,
} from '../../types/audit';

export function generatePrioritizedIssues(
  seo: SeoMetrics,
  perf: CoreWebVitals,
  index: IndexabilityMetrics,
  schema: SchemaMetrics,
  sec: SecurityMetrics,
  soc: SocialMetrics
): AuditIssue[] {
  const issues: AuditIssue[] = [];

  // 1. Indexability: Noindex on Production
  if (index.isNoindex) {
    issues.push({
      id: 'issue-noindex',
      title: 'Balise de non-indexation (noindex) active',
      category: 'indexability',
      severity: 'critical',
      difficulty: 'easy',
      priority: 1,
      evidence: index.robotsMeta ? `Balise meta robots: "${index.robotsMeta}"` : 'En-tête HTTP X-Robots-Tag: noindex',
      impactExplanation:
        'Cette directive ordonne expressément aux moteurs de recherche comme Google d\'exclure cette page de leurs résultats de recherche.',
      recommendation:
        'Supprimez la directive noindex de vos balises d\'en-tête ou de votre configuration serveur si cette page doit générer du trafic organique.',
    });
  }

  // 2. Performance: High LCP
  if (perf.available && perf.lcp.numVal && perf.lcp.numVal > 2.5) {
    const isCritical = perf.lcp.numVal > 4.0;
    issues.push({
      id: 'issue-lcp',
      title: 'Temps de chargement du contenu principal (LCP) élevé',
      category: 'performance',
      severity: isCritical ? 'high' : 'medium',
      difficulty: 'moderate',
      priority: 2,
      evidence: `LCP mesuré à ${perf.lcp.numVal} s (seuil recommandé Google : ≤ 2.5 s)`,
      impactExplanation:
        'Le Largest Contentful Paint mesure le délai avant que le bloc textuel ou visuel principal ne soit pleinement visible. Un délai important dégrade l\'expérience sur mobile.',
      recommendation:
        'Optimisez l\'image héroïque (formats WebP/AVIF, attribut fetchpriority="high"), préchargez les polices critiques et limitez les scripts JavaScript bloquants.',
    });
  }

  // 3. Performance: High CLS
  if (perf.available && perf.cls.numVal && perf.cls.numVal > 0.1) {
    const isCritical = perf.cls.numVal > 0.25;
    issues.push({
      id: 'issue-cls',
      title: 'Instabilité visuelle de la mise en page (CLS)',
      category: 'performance',
      severity: isCritical ? 'high' : 'medium',
      difficulty: 'easy',
      priority: 3,
      evidence: `Score CLS mesuré à ${perf.cls.numVal} (seuil recommandé Google : ≤ 0.1)`,
      impactExplanation:
        'Des éléments sans dimensions réservées provoquent des sauts visuels inattendus au chargement, causant des clics involontaires et de la frustration utilisateur.',
      recommendation:
        'Déclarez explicitement les attributs width et height ou les règles CSS aspect-ratio sur toutes les images, bannières et conteneurs dynamiques.',
    });
  }

  // 4. SEO: Missing Title or problematic length
  if (!seo.hasTitle) {
    issues.push({
      id: 'issue-missing-title',
      title: 'Balise de titre (<title>) absente',
      category: 'seo',
      severity: 'critical',
      difficulty: 'easy',
      priority: 2,
      evidence: 'Aucune balise <title> trouvée dans le code HTML de la page.',
      impactExplanation:
        'Le titre est le signal on-page le plus fondamental pour Google et constitue le lien cliquable principal dans les résultats de recherche.',
      recommendation:
        'Renseignez un titre unique et explicite comprenant votre activité principale et votre zone géographique (ex: "Nom de Marque | Agence Web à Casablanca").',
    });
  } else if (seo.titleStatus === 'warning') {
    issues.push({
      id: 'issue-title-length',
      title: 'Longueur de la balise titre perfectible',
      category: 'seo',
      severity: 'low',
      difficulty: 'easy',
      priority: 6,
      evidence: `Titre actuel : "${seo.titleText}" (${seo.titleLength} caractères, recommandé : 30 à 65)`,
      impactExplanation:
        seo.titleLength < 30
          ? 'Un titre trop court n\'exploite pas pleinement les mots-clés stratégiques recherchés par vos prospects.'
          : 'Un titre trop long risque d\'être tronqué dans les résultats Google sur mobile.',
      recommendation:
        'Ajustez la longueur de votre balise title pour vous situer entre 40 et 60 caractères tout en restant percutant.',
    });
  }

  // 5. SEO: Missing Meta Description
  if (!seo.hasMetaDescription) {
    issues.push({
      id: 'issue-missing-description',
      title: 'Balise méta-description absente',
      category: 'seo',
      severity: 'medium',
      difficulty: 'easy',
      priority: 4,
      evidence: 'Aucune balise meta name="description" détectée dans l\'en-tête HTML.',
      impactExplanation:
        'En l\'absence de description rédigée, Google extrait un extrait arbitraire de votre contenu qui peut être peu vendeur pour les prospects.',
      recommendation:
        'Rédigez une méta-description engageante d\'environ 120 à 155 caractères résumant clairement la valeur ajoutée de votre offre.',
    });
  }

  // 6. Schema: Missing Structured Data
  if (!schema.hasJsonLd) {
    issues.push({
      id: 'issue-missing-schema',
      title: 'Absence de données structurées Schema.org (JSON-LD)',
      category: 'schema',
      severity: 'medium',
      difficulty: 'moderate',
      priority: 4,
      evidence: 'Aucun script de type application/ld+json n\'a été détecté dans le code source.',
      impactExplanation:
        'Les données structurées permettent aux moteurs de recherche et aux systèmes d\'IA (Google AI Overviews, Perplexity) de classifier explicitement votre entité, vos services et vos coordonnées.',
      recommendation:
        'Implémentez un schéma JSON-LD d\'Organization ou de LocalBusiness décrivant votre nom d\'entreprise, logo, adresse, zone de chalandise et coordonnées de contact.',
    });
  } else if (schema.hasParsingError) {
    issues.push({
      id: 'issue-schema-syntax',
      title: 'Erreur de syntaxe dans les données structurées JSON-LD',
      category: 'schema',
      severity: 'high',
      difficulty: 'easy',
      priority: 3,
      evidence: 'Un ou plusieurs blocs <script type="application/ld+json"> contiennent du code JSON invalide.',
      impactExplanation:
        'Un JSON malformé est totalement ignoré par les robots d\'indexation, rendant le schéma inopérant.',
      recommendation:
        'Validez vos blocs JSON-LD avec le Validateur de Schéma officiel (schema.org) et corrigez les erreurs de guillemets ou virgules manquantes.',
    });
  }

  // 7. Security: Insecure HTTP
  if (!sec.isHttps) {
    issues.push({
      id: 'issue-https',
      title: 'Connexion non sécurisée (absence de HTTPS)',
      category: 'security',
      severity: 'critical',
      difficulty: 'moderate',
      priority: 1,
      evidence: 'L\'URL finale utilise le protocole non chiffré "http://".',
      impactExplanation:
        'Les navigateurs modernes affichent un avertissement de sécurité intimidant ("Non sécurisé") qui fait fuir les prospects et pénalise le classement Google.',
      recommendation:
        'Activez un certificat SSL/TLS gratuit (Let\'s Encrypt) et forcez la redirection automatique de tout le trafic HTTP vers HTTPS.',
    });
  }

  // 8. Mobile: Missing Viewport
  if (!seo.hasViewport) {
    issues.push({
      id: 'issue-viewport',
      title: 'Balise méta viewport non optimisée pour mobile',
      category: 'mobile',
      severity: 'high',
      difficulty: 'easy',
      priority: 2,
      evidence: 'Balise meta name="viewport" avec "width=device-width" absente ou incomplète.',
      impactExplanation:
        'Sans viewport adapté, les navigateurs mobiles réduisent la page entière comme sur un écran d\'ordinateur, rendant les textes et boutons illisibles sans zoom manuel.',
      recommendation:
        'Insérez la balise standard dans le <head> : <meta name="viewport" content="width=device-width, initial-scale=1">.',
    });
  }

  // 9. SEO: Headings structure
  if (seo.h1Count === 0) {
    issues.push({
      id: 'issue-missing-h1',
      title: 'Aucun titre principal (balise <h1>) trouvé',
      category: 'seo',
      severity: 'medium',
      difficulty: 'easy',
      priority: 5,
      evidence: '0 balise <h1> détectée sur la page analysée.',
      impactExplanation:
        'Le titre H1 structure le thème central de votre page pour les lecteurs et les robots d\'exploration.',
      recommendation:
        'Ajoutez un titre H1 unique en tête de page explicitant l\'objet principal de votre activité.',
    });
  }

  // 10. Images: Missing Alt text
  if (seo.imagesMissingAlt > 0) {
    const isHigh = seo.imagesMissingAlt > 5 && seo.imagesPercentWithAlt < 70;
    issues.push({
      id: 'issue-images-alt',
      title: `${seo.imagesMissingAlt} image(s) sans attribut de texte alternatif (alt)`,
      category: 'seo',
      severity: isHigh ? 'medium' : 'low',
      difficulty: 'easy',
      priority: 6,
      evidence: `${seo.imagesMissingAlt} sur ${seo.totalImages} image(s) n'ont pas d'attribut alt (${seo.imagesPercentWithAlt}% conformes)`,
      impactExplanation:
        'Les attributs alt permettent l\'indexation de vos visuels dans Google Images et garantissent l\'accessibilité pour les utilisateurs de lecteurs d\'écran.',
      recommendation:
        'Renseignez un descriptif textuel concis et informatif pour chaque image porteuse de sens, ou alt="" pour les éléments purement décoratifs.',
    });
  }

  // 11. Social: Missing OpenGraph
  if (!soc.hasOpenGraph) {
    issues.push({
      id: 'issue-opengraph',
      title: 'Balises d\'aperçu de partage (OpenGraph) manquantes',
      category: 'social',
      severity: 'opportunity',
      difficulty: 'easy',
      priority: 7,
      evidence: 'Balises og:title ou og:image non renseignées dans l\'en-tête HTML.',
      impactExplanation:
        'Lorsqu\'un prospect ou partenaire partage votre lien sur WhatsApp, LinkedIn ou Facebook, le lien apparaît sous forme de texte brut sans vignette visuelle attrayante.',
      recommendation:
        'Intégrez les métadonnées og:title, og:description et une image de 1200x630 pixels dans la balise <head>.',
    });
  }

  // 12. Security: Missing HSTS Header
  if (sec.isHttps && !sec.hstsHeader) {
    issues.push({
      id: 'issue-hsts',
      title: 'En-tête de sécurité HSTS non configuré',
      category: 'security',
      severity: 'low',
      difficulty: 'easy',
      priority: 8,
      evidence: 'En-tête Strict-Transport-Security absent des réponses serveur.',
      impactExplanation:
        'L\'en-tête HSTS informe les navigateurs de ne communiquer qu\'en HTTPS sécurisé, empêchant les attaques de type déclassement SSL (man-in-the-middle).',
      recommendation:
        'Ajoutez l\'en-tête "Strict-Transport-Security: max-age=31536000; includeSubDomains" sur votre serveur web ou CDN.',
    });
  }

  // Sort strictly by priority (1 = highest urgency)
  return issues.sort((a, b) => a.priority - b.priority);
}

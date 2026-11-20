/**
 * Static site configuration for SEO: canonical origin, landing pages, FAQ.
 * Kept separate from lib/config.ts (runtime/env config for the audit engine).
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://audit.arweb.ma').replace(/\/$/, '');
export const SITE_NAME = 'Audit Arweb';
export const AGENCY_URL = 'https://arweb.ma';

export interface FaqItem {
  q: string;
  a: string;
}

export interface LandingPage {
  slug: string;
  /** <title> — keep under ~60 chars */
  title: string;
  description: string;
  overline: string;
  h1: string;
  subtitle: string;
  /** Short label used in footer / cross-links */
  navLabel: string;
  intro: { heading: string; paragraphs: string[] };
  points: { title: string; text: string }[];
  faq: FaqItem[];
}

export const HOME_FAQ: FaqItem[] = [
  {
    q: "L'audit SEO est-il vraiment gratuit ?",
    a: "Oui. L'analyse est gratuite, sans inscription et sans carte bancaire. Vous voyez immédiatement votre score global, les scores par catégorie et les problèmes détectés. Laisser vos coordonnées n'est utile que si vous voulez recevoir un plan d'action personnalisé.",
  },
  {
    q: 'Que vérifie exactement cet outil ?',
    a: "Sept dimensions : SEO technique (title, meta description, H1/H2), vitesse mobile et Core Web Vitals (LCP, CLS, FCP, TTFB), indexabilité (noindex, canonical, robots.txt, sitemap.xml), données structurées Schema.org, ergonomie mobile, sécurité HTTP (HTTPS, HSTS, CSP) et partage social (Open Graph, hreflang).",
  },
  {
    q: "Combien de temps dure l'analyse ?",
    a: "Entre 10 et 40 secondes selon la vitesse de votre site et la disponibilité de l'API Google PageSpeed Insights. Le résultat s'affiche directement sur la page.",
  },
  {
    q: "D'où viennent les mesures de vitesse ?",
    a: "Les Core Web Vitals proviennent de l'API officielle Google PageSpeed Insights (Lighthouse, profil mobile). Si l'API est indisponible, la pondération de la vitesse est redistribuée sur les autres catégories au lieu d'inventer des valeurs.",
  },
  {
    q: 'Quel est un bon score ?',
    a: "Au-dessus de 90/100, votre site est techniquement sain. Entre 70 et 89, il reste des optimisations rentables. En dessous de 70, des problèmes freinent probablement votre visibilité sur Google ou vos conversions mobiles.",
  },
  {
    q: "L'outil fonctionne-t-il pour les sites WordPress, Shopify ou Wix ?",
    a: "Oui. L'audit lit la page publique telle que Google la voit, quel que soit le CMS : WordPress, Shopify, Wix, Webflow, Astro, Next.js ou un site codé sur mesure.",
  },
  {
    q: "Mon site est-il modifié ou stocké pendant l'audit ?",
    a: "Non. L'outil se contente de lire la page d'accueil publique et ses en-têtes HTTP, comme un navigateur. Aucune modification n'est faite et aucune donnée personnelle n'est collectée sans votre accord.",
  },
  {
    q: "Qu'est-ce que la préparation à la recherche IA (GEO) ?",
    a: "C'est la capacité de votre site à être compris et cité par les moteurs de réponse IA comme ChatGPT, Gemini ou Perplexity : données structurées, contenu lisible sans JavaScript, signaux d'entité clairs. L'audit en vérifie les bases.",
  },
];

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: 'test-vitesse-site-web',
    title: 'Test de vitesse de site web gratuit (Core Web Vitals)',
    description:
      'Testez gratuitement la vitesse mobile de votre site : LCP, CLS, FCP, TTFB et Speed Index mesurés via Google PageSpeed. Résultat en 30 secondes, sans inscription.',
    overline: 'Test de vitesse gratuit',
    h1: 'Test de vitesse de site web : mesurez vos Core Web Vitals',
    subtitle:
      'Entrez votre adresse : nous mesurons LCP, CLS, FCP et TTFB sur mobile, et vous indiquons ce qui ralentit réellement votre site.',
    navLabel: 'Test de vitesse',
    intro: {
      heading: 'Pourquoi la vitesse mobile compte',
      paragraphs: [
        "Google classe les pages en utilisant l'expérience mobile. Les Core Web Vitals (LCP, CLS et INP) font partie des signaux de classement, et un site lent perd des visiteurs avant même d'afficher son contenu.",
        "Notre test interroge l'API Google PageSpeed Insights en profil mobile, puis traduit les chiffres en problèmes concrets : image principale trop lourde, scripts bloquants, serveur lent, mise en page instable.",
      ],
    },
    points: [
      { title: 'LCP — Largest Contentful Paint', text: "Temps d'affichage du plus grand élément visible. Objectif : moins de 2,5 secondes sur mobile." },
      { title: 'CLS — Cumulative Layout Shift', text: 'Stabilité visuelle de la page pendant le chargement. Objectif : moins de 0,1.' },
      { title: 'FCP — First Contentful Paint', text: 'Moment où le premier texte ou image apparaît. Objectif : moins de 1,8 seconde.' },
      { title: 'TTFB — Time To First Byte', text: "Temps de réponse du serveur. Au-delà de 800 ms, l'hébergement ou le cache est souvent en cause." },
    ],
    faq: [
      {
        q: 'Quelle différence avec PageSpeed Insights ?',
        a: "Nous utilisons les mêmes mesures Lighthouse, mais nous les combinons avec un audit SEO, indexabilité et sécurité, et nous les expliquons en français avec les priorités à corriger.",
      },
      {
        q: 'Pourquoi mon score varie-t-il entre deux tests ?',
        a: "Les mesures de laboratoire dépendent de la charge du serveur et du réseau au moment du test. Des écarts de quelques points sont normaux ; un écart important signale souvent un hébergement instable.",
      },
      {
        q: 'Comment accélérer un site WordPress ?',
        a: "Les gains les plus rapides viennent généralement des images (format WebP/AVIF, dimensions adaptées), d'un cache de page, de la réduction des plugins et d'un hébergement avec un TTFB bas.",
      },
    ],
  },
  {
    slug: 'verificateur-seo-on-page',
    title: 'Vérificateur SEO on-page gratuit : title, meta, H1',
    description:
      'Vérifiez gratuitement le SEO on-page de votre site : balise title, meta description, H1/H2, canonical, robots.txt, sitemap et Schema.org. Analyse instantanée.',
    overline: 'Vérificateur SEO gratuit',
    h1: 'Vérificateur SEO on-page : title, meta description, H1 et indexation',
    subtitle:
      'Contrôlez en quelques secondes les balises que Google lit en premier, et repérez ce qui empêche vos pages de bien se positionner.',
    navLabel: 'Vérificateur SEO',
    intro: {
      heading: 'Ce que Google lit en premier sur votre page',
      paragraphs: [
        "Avant de juger la qualité d'un contenu, Google lit quelques balises clés : le title, la meta description, le H1, la balise canonical et les directives d'indexation. Une seule erreur à ce niveau peut empêcher une page de se positionner.",
        "Le vérificateur inspecte le code HTML réel de votre page et signale les balises manquantes, trop longues, dupliquées ou contradictoires.",
      ],
    },
    points: [
      { title: 'Balise title', text: 'Présente, unique, entre 30 et 65 caractères, avec votre mot-clé principal au début.' },
      { title: 'Meta description', text: 'Entre 80 et 160 caractères. Elle ne fait pas ranker, mais elle fait cliquer.' },
      { title: 'Structure H1 / H2', text: 'Un seul H1 qui décrit la page, et des H2 qui structurent le contenu.' },
      { title: 'Indexabilité', text: 'Pas de noindex accidentel, canonical auto-référente, robots.txt et sitemap.xml accessibles.' },
    ],
    faq: [
      {
        q: 'Quelle longueur pour une balise title ?',
        a: 'Visez 30 à 65 caractères. Au-delà, Google tronque souvent le titre dans les résultats ; en dessous, vous perdez de la place pour vos mots-clés.',
      },
      {
        q: 'Peut-on avoir plusieurs H1 sur une page ?',
        a: "Techniquement oui en HTML5, mais un H1 unique et explicite reste la pratique la plus claire pour les moteurs de recherche et l'accessibilité.",
      },
      {
        q: 'Les données structurées améliorent-elles le classement ?',
        a: "Pas directement, mais elles rendent votre page éligible aux résultats enrichis (FAQ, avis, fil d'Ariane) et aident les moteurs IA à comprendre votre entreprise.",
      },
    ],
  },
  {
    slug: 'audit-site-web-maroc',
    title: 'Audit de site web gratuit au Maroc | Arweb',
    description:
      'Audit gratuit de site web pour entreprises au Maroc : SEO, vitesse mobile, indexation Google et sécurité. Rapport instantané par Arweb, agence digitale au Maroc.',
    overline: 'Entreprises au Maroc',
    h1: 'Audit de site web gratuit pour les entreprises au Maroc',
    subtitle:
      "Votre site est-il prêt pour vos clients au Maroc, qui naviguent surtout sur mobile ? Obtenez un diagnostic SEO et vitesse en 30 secondes.",
    navLabel: 'Audit site web Maroc',
    intro: {
      heading: 'Un diagnostic adapté au marché marocain',
      paragraphs: [
        "Au Maroc, la grande majorité des visites se fait sur smartphone, souvent en 4G. Un site lent ou mal référencé laisse le champ libre aux concurrents sur Google, Google Maps et maintenant les assistants IA.",
        "L'audit Arweb vérifie la vitesse mobile, le SEO technique, la gestion des versions français/arabe (hreflang) et les données structurées LocalBusiness qui aident Google à afficher votre entreprise localement.",
      ],
    },
    points: [
      { title: 'Vitesse sur mobile', text: 'Mesurée en profil mobile Lighthouse, au plus proche des conditions réelles de vos visiteurs.' },
      { title: 'SEO multilingue', text: "Vérification des balises hreflang pour les sites en français, arabe et anglais." },
      { title: 'Présence locale', text: 'Détection des données structurées Organization et LocalBusiness.' },
      { title: 'Accompagnement', text: "Si vous le souhaitez, un ingénieur Arweb vous explique les résultats et le plan d'action, sur WhatsApp ou par e-mail." },
    ],
    faq: [
      {
        q: "Combien coûte un audit SEO complet au Maroc ?",
        a: "L'audit automatique sur cette page est gratuit. Pour un audit approfondi de toutes les pages avec plan d'action chiffré, contactez Arweb : le devis dépend de la taille du site.",
      },
      {
        q: 'Arweb peut-il corriger les problèmes détectés ?',
        a: "Oui. Arweb est une agence de développement web et SEO basée au Maroc. Nous pouvons optimiser votre site existant ou le refondre si la base technique est trop limitée.",
      },
      {
        q: 'Faut-il un site bilingue français/arabe ?',
        a: "Cela dépend de votre clientèle. Si vous publiez plusieurs langues, chaque version doit avoir sa propre URL et des balises hreflang correctes, sinon Google risque de n'en indexer qu'une.",
      },
    ],
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find((p) => p.slug === slug);
}

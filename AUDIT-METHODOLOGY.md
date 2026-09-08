# Méthodologie d'Audit Technique ARWEB

Ce document détaille les principes d'ingénierie, les formules de calcul et les règles d'évaluation appliqués par l'outil d'audit technique d'**ARWEB** (`audit.arweb.ma`).

---

## 1. Principes Fondamentaux

1. **Intégrité et Crédibilité Technique** :
   - Aucun score artificiel ou pénalité arbitraire.
   - Les sites techniquement irréprochables (performants, sécurisés, bien balisés) obtiennent des scores de **90 à 100/100**.
   - Aucune extrapolation commerciale trompeuse : nous ne générons pas de fausses estimations de « perte de chiffre d'affaires » en dirhams ou en pourcentage sans données analytiques réelles.

2. **Mesures Réelles & Détections Factuelles** :
   - Toutes les métriques proviennent soit d'une mesure directe (TTFB, statut HTTP, balises HTML, JSON-LD, en-têtes de sécurité), soit des sondes officielles de Google PageSpeed Insights V5 (Lighthouse lab).
   - En cas d'indisponibilité de l'API Google, le système bascule de façon transparente sur l'audit direct sans inventer de valeurs synthétiques.

3. **Protection de la Vie Privée & Sécurité SSRF** :
   - Validation stricte des URL cibles avec résolution DNS amont bloquant les adresses IP privées (RFC 1918), le loopback, le link-local et les métadonnées cloud (AWS, GCP, Azure, DigitalOcean).
   - Aucun stockage de données personnelles (PII) dans le code source ou dans des fichiers non chiffrés.

---

## 2. Décomposition des 7 Dimensions & Pondérations

Le score global composite (sur 100) est calculé à partir de 7 piliers techniques indépendants :

| Pilier | Poids Nominal | Description & Critères Évalués |
|---|:---:|---|
| **1. SEO Technique** | **30%** | Présence et longueur optimale de `<title>` (30-65 car.), `<meta description>` (80-160 car.), unicité du `<h1>`, hiérarchie des `<h2>`, favicon. |
| **2. Vitesse & Core Web Vitals** | **25%** | LCP (≤ 2.5s), CLS (≤ 0.1), FCP (≤ 1.8s), TTFB (≤ 800ms) et Speed Index (≤ 3.4s). Mesuré via Google PageSpeed Insights V5 ou direct. |
| **3. Indexabilité & Exploration** | **15%** | Absence de directive `noindex` involontaire, URL canonique auto-référente, accessibilité de `robots.txt` et déclaration du `sitemap.xml`. |
| **4. Données Structurées (Schema.org)** | **10%** | Détection et validation syntaxique des blocs JSON-LD (`@Organization`, `@LocalBusiness`, `@Service`, `@WebSite`, `@FAQPage`, etc.). |
| **5. Ergonomie Mobile & Médias** | **10%** | Balise `<meta name="viewport">` responsive, taux de remplissage des attributs `alt` sur les images, chargement différé (`loading="lazy"`). |
| **6. Sécurité & En-têtes HTTP** | **5%** | Protocole HTTPS obligatoire, absence de contenu mixte (HTTP dans HTTPS), présence de HSTS, CSP et en-tête `X-Content-Type-Options: nosniff`. |
| **7. Partage Social & Multilinguisme** | **5%** | Balises OpenGraph complètes (`og:image`, `og:title`), cartes Twitter/X et balises d'internationalisation `hreflang` (FR/EN/AR). |

---

## 3. Règle de Redistribution Équitable (Failover PageSpeed)

Lorsque l'API PageSpeed Insights est inaccessible, saturée par les quotas ou indisponible :
- La pondération de **25%** de la performance est automatiquement redistribuée au prorata sur les **6 autres dimensions factuelles**.
- Le TTFB mesuré directement par notre analyseur réseau continue d'être affiché et pris en compte.
- Cela garantit qu'un site parfaitement codé ne reçoit **jamais** de note médiocre suite à une défaillance de service tiers.

---

## 4. Échelle de Notation & Niveaux

Le score final est associé à un niveau technique :

- **90 – 100** : Niveau **A+** (Excellence technique, conformité maximale aux standards Google 2026).
- **80 – 89** : Niveau **A** (Très bonne santé digitale, optimisations mineures).
- **70 – 79** : Niveau **B** (Bonne structure de base, opportunités d'amélioration identifiées).
- **55 – 69** : Niveau **C** (Freins techniques notables nécessitant un plan d'action).
- **40 – 54** : Niveau **D** (Anomalies impactant directement le référencement et la conversion mobile).
- **0 – 39** : Niveau **F** (Points de friction critiques : noindex, absence de HTTPS ou viewport manquant).

---

## 5. Préparation à la Recherche Sémantique & Moteurs IA

Le module **AI Readiness** évalue la clarté de la page pour les moteurs de réponse conversationnels (Google AI Overviews, Perplexity, ChatGPT Search) :
- Formalisation claire de l'entité légale (`@Organization` / `@LocalBusiness`).
- Présence d'un titre et d'une description synthétique compréhensibles par des modèles de langage.
- Balises d'identification géographique et linguistique adaptées au marché marocain et international.
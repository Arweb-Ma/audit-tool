# ARWEB Website Audit Tool (`audit.arweb.ma`)

> Outil d'audit technique et diagnostic de performance web développé pour l'agence digitale **ARWEB** ([arweb.ma](https://arweb.ma)).

Conçu pour offrir une analyse factuelle, crédible et rigoureuse de la santé technique d'un site web : vitesse mobile (Core Web Vitals), structure SEO, indexabilité, données structurées Schema.org, sécurité et préparation à la recherche sémantique & IA.

---

## 🌟 Principes Clés

- **Crédibilité Technique** : Zéro score artificiel ou pénalité arbitraire. Un site sain et bien codé obtient un score réel entre 90 et 100/100.
- **Transparence** : Inspection factuelle des balises HTML, titres H1/H2, images avec/sans alt, schémas JSON-LD extraits et en-têtes HTTP de sécurité.
- **Failover Équitable** : En cas d'indisponibilité de l'API PageSpeed Insights, la pondération de la vitesse est redistribuée sans pénaliser artificiellement la note globale.
- **Sécurité Anti-SSRF** : Résolution DNS amont interdisant l'accès aux réseaux internes, plages RFC 1918, loopback et métadonnées cloud.
- **Sans Coût Additionnel** : Conçu pour s'intégrer gratuitement à Supabase (ou fonctionner de manière autonome en mode dev).

---

## 📐 Méthodologie & Pondération (7 Dimensions)

1. **SEO Technique (30%)** : Title (longueur & présence), meta-description, unicité H1, hiérarchie H2, favicon.
2. **Vitesse & Core Web Vitals (25%)** : LCP, CLS, FCP, TTFB et Speed Index.
3. **Indexabilité & Exploration (15%)** : Absence de noindex involontaire, canonical auto-référente, robots.txt et sitemap.xml.
4. **Données Structurées JSON-LD (10%)** : Détection `@Organization`, `@LocalBusiness`, `@Service`, `@WebSite`, syntaxe JSON.
5. **Ergonomie Mobile (10%)** : Viewport responsive, ratio de textes alternatifs (alt) sur les images, lazy-loading.
6. **Sécurité & En-têtes (5%)** : HTTPS, HSTS, CSP, X-Content-Type-Options, absence de contenu mixte.
7. **Partage & Social (5%)** : OpenGraph (og:image, og:title), cartes Twitter/X et balises multilingues hreflang.

Pour une description mathématique complète, consultez [AUDIT-METHODOLOGY.md](./AUDIT-METHODOLOGY.md).

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ (testé avec Node.js 20 et 23)
- npm ou pnpm

### Installation
```bash
git clone https://github.com/Arweb-Ma/audit-tool.git
cd audit-tool
npm install
```

### Lancement en Développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🧪 Tests Automatisés

Une suite de tests vérifie la protection SSRF, la normalisation des URL, le moteur de notation et le parseur JSON-LD :

```bash
npx tsx test/audit-engine.test.ts
```

---

## 📦 Build de Production

```bash
npm run build
npm run start
```

Consultez [PRODUCTION-READINESS.md](./PRODUCTION-READINESS.md) pour les instructions détaillées de configuration et de déploiement.

---

## 📬 Contact & Support

- **Agence** : [ARWEB](https://arweb.ma) (Casablanca, Maroc)
- **WhatsApp direct** : `+212 665 016 504`
- **Email** : `contact@arweb.ma`
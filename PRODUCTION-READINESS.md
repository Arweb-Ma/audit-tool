# Guide de Déploiement & Préparation Production ARWEB

Ce guide résume la configuration requise pour déployer l'outil d'audit sur l'infrastructure d'ARWEB (`audit.arweb.ma`).

---

## 1. Variables d'Environnement

Créez un fichier `.env.local` en local ou configurez ces variables dans votre interface d'hébergement (Netlify, Vercel ou VPS) :

```bash
# Numéro WhatsApp officiel ARWEB (format international sans le signe +)
NEXT_PUBLIC_WHATSAPP_NUMBER="212665016504"

# Email officiel de contact
NEXT_PUBLIC_CONTACT_EMAIL="contact@arweb.ma"

# Domaine de production
NEXT_PUBLIC_APP_URL="https://audit.arweb.ma"

# Clé API Google PageSpeed Insights (optionnelle mais recommandée pour lever les quotas d'anonymat)
PAGESPEED_API_KEY=""

# Base de données Supabase (Tier Gratuit - Recommandé pour la persistance des leads)
# La table SQL est définie dans lib/db/schema.sql
SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""

# Sécurité & Rate Limiting (options avec valeurs par défaut de production)
RATE_LIMIT_AUDITS_PER_HOUR=10
RATE_LIMIT_LEADS_PER_HOUR=5
AUDIT_TIMEOUT_MS=10000
```

---

## 2. Configuration de la Base de Données Gratuite (Supabase)

1. Rendez-vous sur [Supabase.com](https://supabase.com) et créez un projet gratuit.
2. Ouvrez l'éditeur **SQL Editor** dans le dashboard Supabase.
3. Exécutez le script situé dans `lib/db/schema.sql` :
   ```sql
   create table if not exists public.leads (
     id uuid primary key default gen_random_uuid(),
     created_at timestamp with time zone default now() not null,
     name text not null,
     email text not null,
     whatsapp text not null,
     sector text,
     website_url text not null,
     audit_score integer not null,
     category_scores jsonb,
     top_issues jsonb,
     consent_given boolean default true not null,
     status text default 'new' not null check (status in ('new', 'contacted', 'qualified', 'archived'))
   );
   ```
4. Copiez l'**URL du projet** et la **clé secrète de service (`service_role`)** dans vos variables d'environnement.
5. **Mode Développement / Sans Clé** : Si aucune clé Supabase n'est configurée, l'outil continue de fonctionner de manière autonome sans planter et sans écrire de données PII non chiffrées sur le disque.

---

## 3. Sécurité & Protection contre le SSRF

- **Validation DNS Amont** : Chaque URL soumise subit une résolution DNS préalable (`node:dns/promises`).
- **Filtrage des adresses IP privées** : Les requêtes vers `127.0.0.1`, `localhost`, les plages RFC 1918 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), le link-local et l'endpoint de métadonnées cloud (`169.254.169.254`) sont interceptées et bloquées avec une erreur explicite.
- **Contrôle des Redirections** : Les redirections HTTP ne sont pas suivies aveuglément ; chaque saut est résolu et vérifié contre les plages IP privées (maximum 3 sauts).
- **Limitation de taille et de temps** : Les réponses sont limitées à 2 Mo et soumises à un timeout strict de 10 secondes.

---

## 4. Tests et Vérification Locale

Pour exécuter la suite de tests automatisés :
```bash
npx tsx test/audit-engine.test.ts
```

Pour compiler le projet en mode production :
```bash
npm run build
```

Pour lancer le serveur de test local :
```bash
npm run start
```
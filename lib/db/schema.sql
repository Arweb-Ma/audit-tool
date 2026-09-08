-- Table de stockage des prospects pour l'outil d'audit ARWEB (audit.arweb.ma)
-- Compatible Supabase / PostgreSQL standard (100% gratuit)

CREATE TABLE IF NOT EXISTS arweb_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  sector TEXT DEFAULT 'Général',
  website_url TEXT NOT NULL,
  audit_score INTEGER NOT NULL,
  category_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  top_issues JSONB NOT NULL DEFAULT '[]'::jsonb,
  consent_given BOOLEAN DEFAULT TRUE,
  source TEXT DEFAULT 'audit.arweb.ma',
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'archived'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index de recherche rapide
CREATE INDEX IF NOT EXISTS idx_arweb_leads_created_at ON arweb_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_arweb_leads_email ON arweb_leads(email);
CREATE INDEX IF NOT EXISTS idx_arweb_leads_status ON arweb_leads(status);

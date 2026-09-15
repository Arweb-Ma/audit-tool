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

-- Table de limitation de requêtes serverless (Netlify / Vercel)
CREATE TABLE IF NOT EXISTS arweb_rate_limits (
  key TEXT PRIMARY KEY,
  timestamps JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table de cache persistant des audits
CREATE TABLE IF NOT EXISTS arweb_cache (
  url TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_arweb_cache_expires_at ON arweb_cache(expires_at);

-- Short-lived, server-verified audit records. These replace process memory so
-- lead verification continues to work after an application restart or across
-- multiple Node.js workers on a VPS.
CREATE TABLE IF NOT EXISTS arweb_audit_sessions (
  audit_id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_arweb_audit_sessions_expires_at
  ON arweb_audit_sessions(expires_at);

-- Atomically consumes one request from a rolling rate-limit window. Calling
-- this function is safe when several requests reach the application together;
-- the conflicting row is locked by the UPSERT before its timestamps are read.
CREATE OR REPLACE FUNCTION arweb_consume_rate_limit(
  p_key TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER DEFAULT 3600
)
RETURNS TABLE(success BOOLEAN, limit_value INTEGER, remaining INTEGER, reset_in_seconds INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
  v_now_ms BIGINT := FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000);
  v_cutoff_ms BIGINT := v_now_ms - (p_window_seconds * 1000);
  v_timestamps JSONB;
  v_count INTEGER;
  v_oldest_ms BIGINT;
BEGIN
  IF p_limit < 1 OR p_window_seconds < 1 THEN
    RAISE EXCEPTION 'Rate-limit arguments must be positive';
  END IF;

  INSERT INTO arweb_rate_limits AS rate_limit (key, timestamps, updated_at)
  VALUES (p_key, '[]'::jsonb, NOW())
  ON CONFLICT (key) DO UPDATE SET updated_at = EXCLUDED.updated_at
  RETURNING timestamps INTO v_timestamps;

  SELECT COALESCE(jsonb_agg(to_jsonb(entry.value::BIGINT) ORDER BY entry.value::BIGINT), '[]'::jsonb)
  INTO v_timestamps
  FROM jsonb_array_elements_text(v_timestamps) AS entry(value)
  WHERE entry.value::BIGINT > v_cutoff_ms;

  v_count := jsonb_array_length(v_timestamps);
  IF v_count >= p_limit THEN
    SELECT MIN(entry.value::BIGINT) INTO v_oldest_ms
    FROM jsonb_array_elements_text(v_timestamps) AS entry(value);

    UPDATE arweb_rate_limits
    SET timestamps = v_timestamps, updated_at = NOW()
    WHERE key = p_key;

    RETURN QUERY SELECT FALSE, p_limit, 0,
      GREATEST(1, CEIL((v_oldest_ms + (p_window_seconds * 1000) - v_now_ms) / 1000.0)::INTEGER);
    RETURN;
  END IF;

  v_timestamps := v_timestamps || jsonb_build_array(v_now_ms);
  UPDATE arweb_rate_limits
  SET timestamps = v_timestamps, updated_at = NOW()
  WHERE key = p_key;

  SELECT MIN(entry.value::BIGINT) INTO v_oldest_ms
  FROM jsonb_array_elements_text(v_timestamps) AS entry(value);

  RETURN QUERY SELECT TRUE, p_limit, p_limit - jsonb_array_length(v_timestamps),
    GREATEST(1, CEIL((v_oldest_ms + (p_window_seconds * 1000) - v_now_ms) / 1000.0)::INTEGER);
END;
$$;

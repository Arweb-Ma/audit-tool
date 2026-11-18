import crypto from 'node:crypto';
import { AuditResult } from '../types/audit';
import { config } from './config';

/**
 * Signed, self-contained audit tokens.
 *
 * The lead form must prove that the score it submits really came from our audit, without trusting
 * the browser. Keeping audits in server memory does not work on Netlify: the audit and the lead
 * form can be answered by two different function instances, and the second one has never seen the
 * audit. Instead, the audit summary travels with the visitor, signed with HMAC-SHA256: any instance
 * can check it, and nobody can change the score without breaking the signature.
 *
 * Format: aud_<base64url(payload)>.<base64url(signature)>
 */

export const AUDIT_TOKEN_TTL_SECONDS = 24 * 60 * 60;
const PREFIX = 'aud_';
const MAX_EVIDENCE_LENGTH = 300;
const MAX_ISSUES = 5;

export interface VerifiedAudit {
  auditId: string;
  url: string;
  overallScore: number;
  categoryScores: Record<string, number>;
  issues: { title: string; severity: string; evidence?: string }[];
}

interface TokenPayload {
  v: 1;
  n: string; // nonce, so two audits of the same site never share a token
  u: string;
  s: number;
  c: Record<string, number>;
  i: { t: string; s: string; e?: string }[];
  exp: number; // unix seconds
}

let processSecret: Buffer | undefined;

/**
 * AUDIT_SIGNING_SECRET if set; otherwise derived from the Supabase service-role key, which is
 * already a server-only secret. Only when neither exists (local development) does each process
 * invent its own, which makes tokens valid on that process only.
 */
function signingKey(): Buffer {
  const explicit = process.env.AUDIT_SIGNING_SECRET;
  if (explicit) return crypto.createHash('sha256').update(`audit-token:${explicit}`).digest();
  const serviceKey = config.database.supabaseServiceRoleKey;
  if (serviceKey) return crypto.createHash('sha256').update(`audit-token:${serviceKey}`).digest();
  processSecret ??= crypto.randomBytes(32);
  return processSecret;
}

const b64 = (data: Buffer | string) => Buffer.from(data).toString('base64url');

function sign(body: string): string {
  return b64(crypto.createHmac('sha256', signingKey()).update(body).digest());
}

export function createAuditToken(
  result: Pick<AuditResult, 'url' | 'overallScore' | 'categoryScores' | 'issues'>,
  ttlSeconds = AUDIT_TOKEN_TTL_SECONDS,
  now = Date.now()
): string {
  const payload: TokenPayload = {
    v: 1,
    n: crypto.randomBytes(9).toString('base64url'),
    u: result.url,
    s: result.overallScore,
    c: Object.fromEntries(
      Object.entries(result.categoryScores || {}).map(([name, category]) => [name, Number((category as { score: number }).score)])
    ),
    i: (result.issues || []).slice(0, MAX_ISSUES).map((issue) => ({
      t: issue.title,
      s: issue.severity,
      ...(issue.evidence ? { e: String(issue.evidence).slice(0, MAX_EVIDENCE_LENGTH) } : {}),
    })),
    exp: Math.floor(now / 1000) + ttlSeconds,
  };
  const body = b64(JSON.stringify(payload));
  return `${PREFIX}${body}.${sign(body)}`;
}

export function verifyAuditToken(token: string, now = Date.now()): VerifiedAudit | null {
  if (typeof token !== 'string' || !token.startsWith(PREFIX)) return null;
  const [body, signature, ...rest] = token.slice(PREFIX.length).split('.');
  if (!body || !signature || rest.length > 0) return null;

  const expected = Buffer.from(sign(body));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (payload?.v !== 1 || typeof payload.exp !== 'number' || payload.exp * 1000 < now) return null;
  if (typeof payload.u !== 'string' || typeof payload.s !== 'number') return null;

  return {
    auditId: token,
    url: payload.u,
    overallScore: payload.s,
    categoryScores: payload.c || {},
    issues: (payload.i || []).map((issue) => ({
      title: issue.t,
      severity: issue.s,
      ...(issue.e ? { evidence: issue.e } : {}),
    })),
  };
}

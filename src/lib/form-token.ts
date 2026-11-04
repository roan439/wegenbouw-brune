import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Ondertekend tijdstempel-token: bewijst dat het formulier via de website is geopend
 * en niet binnen een paar seconden door een bot is ingevuld.
 */
const MIN_AGE_MS = 3_000;
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

function secret() {
  return process.env.FORM_SIGNING_SECRET || "";
}

function sign(ts: string) {
  return createHmac("sha256", secret()).update(`brune-form:${ts}`).digest("base64url");
}

export function issueToken(): string {
  const ts = Date.now().toString(36);
  return `${ts}.${sign(ts)}`;
}

export type TokenCheck = "ok" | "missing-secret" | "invalid" | "too-fast" | "expired";

export function verifyToken(token: string): TokenCheck {
  if (!secret()) return "missing-secret";
  const [ts, sig] = token.split(".");
  if (!ts || !sig) return "invalid";
  const expected = Buffer.from(sign(ts));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid";
  const age = Date.now() - parseInt(ts, 36);
  if (!Number.isFinite(age)) return "invalid";
  if (age < MIN_AGE_MS) return "too-fast";
  if (age > MAX_AGE_MS) return "expired";
  return "ok";
}

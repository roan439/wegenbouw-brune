import { NextResponse, type NextRequest } from "next/server";
import { contactSchema, type ContactData, type FieldErrors } from "@/lib/contact-schema";
import { issueToken, verifyToken } from "@/lib/form-token";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/content/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;

function json(body: unknown, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "onbekend"
  );
}

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // sommige clients sturen geen Origin; overige checks blijven gelden
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** GET: geeft een vers, ondertekend formuliertoken uit. */
export async function GET() {
  return json({ token: issueToken() });
}

/** POST: valideert en verstuurt een offerteaanvraag per e-mail (server-side). */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ ok: false, message: "Ongeldige herkomst." }, 403);

  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) return json({ ok: false, message: "Bericht is te groot." }, 413);

  const ip = clientIp(req);
  const rl = rateLimit(`contact:${ip}`);
  if (!rl.ok) {
    return json(
      { ok: false, message: "Te veel aanvragen. Probeer het over enkele minuten opnieuw of bel ons." },
      429,
      { "Retry-After": String(rl.retryAfter) },
    );
  }

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, message: "Bericht is te groot." }, 413);
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, message: "Ongeldig verzoek." }, 400);
  }

  // Honeypot: bots vullen het verborgen veld in. Doe alsof het gelukt is.
  if (raw && typeof raw === "object" && "website" in raw && String((raw as { website?: unknown }).website ?? "") !== "") {
    return json({ ok: true });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactData;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return json({ ok: false, message: "Controleer de gemarkeerde velden.", errors }, 422);
  }
  const data = parsed.data;

  // Tijd-token
  const tokenCheck = verifyToken(data.token);
  if (tokenCheck === "missing-secret") {
    console.warn("[contact] FORM_SIGNING_SECRET ontbreekt — tijd-token controle overgeslagen.");
  } else if (tokenCheck !== "ok") {
    return json(
      {
        ok: false,
        message:
          tokenCheck === "expired"
            ? "Het formulier is verlopen. Vernieuw de pagina en probeer het opnieuw."
            : "Verzenden mislukt. Vernieuw de pagina en probeer het opnieuw.",
      },
      400,
    );
  }

  // Optioneel: Cloudflare Turnstile
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const body = new URLSearchParams({ secret: turnstileSecret, response: data.turnstileToken, remoteip: ip });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const outcome = (await res.json().catch(() => ({ success: false }))) as { success?: boolean };
    if (!outcome.success) {
      return json({ ok: false, message: "Spamcontrole mislukt. Probeer het opnieuw." }, 400);
    }
  }

  // E-mail versturen via Resend
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || site.email;

  const rows: [string, string][] = [
    ["Naam", data.name],
    ["Bedrijf", data.company || "—"],
    ["E-mail", data.email],
    ["Telefoon", data.phone || "—"],
    ["Projectlocatie", data.location],
    ["Werkzaamheden", data.workType],
  ];
  const subject = `Offerteaanvraag: ${data.workType} — ${data.location}`.slice(0, 180);
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nBericht:\n${data.message}\n\n— Verzonden via ${site.url}`;
  const html = `<!doctype html><html lang="nl"><body style="font-family:Arial,sans-serif;color:#0d0e0f">
<h2 style="margin:0 0 16px">Nieuwe offerteaanvraag via de website</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#666;padding-right:16px">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>
<h3 style="margin:24px 0 8px">Bericht</h3>
<p style="white-space:pre-wrap;line-height:1.5">${esc(data.message)}</p>
<hr style="border:none;border-top:1px solid #ddd;margin:24px 0"/>
<p style="color:#888;font-size:12px">Verzonden via ${esc(site.url)}</p></body></html>`;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY/CONTACT_FROM_EMAIL niet ingesteld — aanvraag (dev):\n" + text);
      return json({ ok: true, dev: true });
    }
    console.error("[contact] E-mailverzending is niet geconfigureerd.");
    return json(
      { ok: false, message: `Verzenden is tijdelijk niet mogelijk. Mail ons via ${site.email} of bel ${site.phone.display}.` },
      503,
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: data.email, subject, text, html }),
    });
    if (!res.ok) {
      console.error("[contact] Resend-fout", res.status, await res.text().catch(() => ""));
      throw new Error("send failed");
    }
  } catch {
    return json(
      { ok: false, message: `Er ging iets mis bij het verzenden. Mail ons via ${site.email} of bel ${site.phone.display}.` },
      502,
    );
  }

  return json({ ok: true });
}

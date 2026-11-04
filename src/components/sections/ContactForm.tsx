"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { contactSchema, workTypes, type FieldErrors } from "@/lib/contact-schema";
import { WORK_TYPE_EVENT } from "@/lib/events";

type Status = "idle" | "sending" | "success" | "error";

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [workType, setWorkType] = useState("");
  const tokenRef = useRef("");

  // Vers formuliertoken ophalen (tijdcontrole tegen bots)
  useEffect(() => {
    fetch("/api/contact", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { token?: string }) => (tokenRef.current = d.token ?? ""))
      .catch(() => {});
  }, []);

  // Voorselectie vanuit een dienstkaart
  useEffect(() => {
    const onSelect = (e: Event) => {
      const v = (e as CustomEvent<string>).detail;
      if ((workTypes as readonly string[]).includes(v)) setWorkType(v);
    };
    window.addEventListener(WORK_TYPE_EVENT, onSelect);
    return () => window.removeEventListener(WORK_TYPE_EVENT, onSelect);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      location: String(fd.get("location") ?? ""),
      workType: String(fd.get("workType") ?? ""),
      message: String(fd.get("message") ?? ""),
      privacy: fd.get("privacy") === "on",
      website: String(fd.get("website") ?? ""),
      token: tokenRef.current,
      turnstileToken: String(fd.get("cf-turnstile-response") ?? ""),
    };

    // Directe validatie in de browser (de server valideert opnieuw)
    const check = contactSchema.safeParse(payload);
    if (!check.success) {
      const errs: FieldErrors = {};
      for (const i of check.error.issues) {
        const k = i.path[0] as keyof FieldErrors;
        if (k && !errs[k]) errs[k] = i.message;
      }
      setErrors(errs);
      setStatus("error");
      setMessage("Controleer de gemarkeerde velden.");
      const first = Object.keys(errs)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: FieldErrors };
      if (res.ok && data.ok) {
        setStatus("success");
        form.reset();
        setWorkType("");
        return;
      }
      setErrors(data.errors ?? {});
      setStatus("error");
      setMessage(data.message ?? "Er ging iets mis. Probeer het opnieuw.");
    } catch {
      setStatus("error");
      setMessage("Geen verbinding. Controleer uw internet en probeer het opnieuw.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        role="status"
        className="flex min-h-[28rem] flex-col items-start justify-center rounded-[1.75rem] border border-brune/40 bg-white/[0.03] p-8 sm:p-12"
      >
        <span className="grid size-14 place-items-center rounded-full bg-brune text-2xl text-ink">✓</span>
        <h3 className="mt-6 font-display text-3xl font-extrabold tracking-tight">Bedankt voor uw aanvraag!</h3>
        <p className="mt-3 max-w-md leading-relaxed text-white/70">
          We hebben uw bericht ontvangen en nemen zo snel mogelijk contact met u op om uw project te bespreken.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn btn-ghost mt-8">
          Nog een aanvraag versturen
        </button>
      </motion.div>
    );
  }

  const err = (k: keyof FieldErrors) => errors[k];
  const fieldProps = (k: keyof FieldErrors) => ({
    name: k,
    id: `f-${String(k)}`,
    "aria-invalid": err(k) ? (true as const) : undefined,
    "aria-describedby": err(k) ? `f-${String(k)}-err` : undefined,
  });

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="formulier-titel"
      className="rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-6 sm:p-10"
    >
      <h3 id="formulier-titel" className="font-display text-2xl font-extrabold tracking-tight">
        Offerte aanvragen
      </h3>
      <p className="mt-1 text-sm text-white/55">Velden met * zijn verplicht.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Naam *" htmlFor="f-name" error={err("name")}>
          <input {...fieldProps("name")} className="field" autoComplete="name" required />
        </Field>
        <Field label="Bedrijf / organisatie" htmlFor="f-company" error={err("company")}>
          <input {...fieldProps("company")} className="field" autoComplete="organization" />
        </Field>
        <Field label="E-mailadres *" htmlFor="f-email" error={err("email")}>
          <input {...fieldProps("email")} type="email" inputMode="email" className="field" autoComplete="email" required />
        </Field>
        <Field label="Telefoonnummer" htmlFor="f-phone" error={err("phone")}>
          <input {...fieldProps("phone")} type="tel" inputMode="tel" className="field" autoComplete="tel" />
        </Field>
        <Field label="Projectlocatie *" htmlFor="f-location" error={err("location")}>
          <input {...fieldProps("location")} className="field" placeholder="Straat en/of plaats" autoComplete="address-level2" required />
        </Field>
        <Field label="Type werkzaamheden *" htmlFor="f-workType" error={err("workType")}>
          <div className="relative">
            <select
              {...fieldProps("workType")}
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="field appearance-none pr-10"
              required
            >
              <option value="" disabled>
                Maak een keuze
              </option>
              {workTypes.map((w) => (
                <option key={w} value={w} className="bg-char">
                  {w}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
              ▾
            </span>
          </div>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Uw bericht *" htmlFor="f-message" error={err("message")}>
            <textarea
              {...fieldProps("message")}
              rows={5}
              className="field resize-y"
              placeholder="Omschrijf kort het project, de gewenste planning en eventuele bijzonderheden."
              required
            />
          </Field>
        </div>
      </div>

      {/* Honeypot — onzichtbaar voor mensen */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-white/70">
          <input
            type="checkbox"
            name="privacy"
            aria-invalid={err("privacy") ? true : undefined}
            aria-describedby={err("privacy") ? "f-privacy-err" : undefined}
            className="mt-0.5 size-5 shrink-0 accent-[var(--color-brune)]"
          />
          <span>
            Ik ga akkoord met de verwerking van mijn gegevens volgens de{" "}
            <a href="/privacyverklaring" className="font-semibold text-white underline decoration-brune underline-offset-4">
              privacyverklaring
            </a>
            . *
          </span>
        </label>
        {err("privacy") && (
          <p id="f-privacy-err" className="mt-2 text-sm text-[#ff7a70]">
            {err("privacy")}
          </p>
        )}
      </div>

      {TURNSTILE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile mt-6" data-sitekey={TURNSTILE_KEY} data-theme="dark" data-language="nl" />
        </>
      )}

      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="min-h-[1.5rem] text-sm">
          <AnimatePresence>
            {status === "error" && message && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[#ff7a70]">
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <button type="submit" disabled={status === "sending"} className="btn btn-primary min-h-14 px-8 disabled:opacity-60">
          {status === "sending" ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" aria-hidden />
              Versturen…
            </>
          ) : (
            "Aanvraag versturen"
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-white/80">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-err`} className="mt-1.5 text-sm text-[#ff7a70]">
          {error}
        </p>
      )}
    </div>
  );
}

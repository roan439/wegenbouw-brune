import { z } from "zod";
import { services } from "@/content/services";

export const workTypes = [...services.map((s) => s.title), "Anders / weet ik nog niet"] as const;

const phoneRegex = /^[+()\-.\s0-9]{8,20}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Vul uw naam in.").max(100, "Naam is te lang."),
  company: z.string().trim().max(120, "Bedrijfsnaam is te lang.").optional().default(""),
  email: z.string().trim().email("Vul een geldig e-mailadres in.").max(160),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .default("")
    .refine((v) => v === "" || phoneRegex.test(v), "Vul een geldig telefoonnummer in."),
  location: z.string().trim().min(2, "Vul de projectlocatie in.").max(150, "Locatie is te lang."),
  workType: z.string().refine((v) => (workTypes as readonly string[]).includes(v), "Kies een type werkzaamheden."),
  message: z
    .string()
    .trim()
    .min(10, "Vertel ons iets meer over uw project (min. 10 tekens).")
    .max(5000, "Bericht is te lang (max. 5000 tekens)."),
  privacy: z.literal(true, { errorMap: () => ({ message: "Ga akkoord met de privacyverklaring." }) }),
  // Spambescherming
  website: z.string().max(500).optional().default(""), // honeypot — wordt in de API gecontroleerd
  token: z.string().max(200).optional().default(""),
  turnstileToken: z.string().max(4096).optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type FieldErrors = Partial<Record<keyof ContactData, string>>;

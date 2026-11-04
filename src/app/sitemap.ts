import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/privacyverklaring`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/algemene-voorwaarden`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}

import { projects as localProjects, type Project } from "@/content/projects";

/**
 * Data-laag voor projecten. Vandaag leest dit de lokale content; koppel hier een CMS.
 *
 * Voorbeeld (Sanity):
 *   const data = await client.fetch(`*[_type=="project"]|order(_createdAt desc){...}`,
 *                                   {}, { next: { revalidate: 3600, tags: ["projects"] } });
 *   return data.map(mapSanityProject);
 *
 * Voorbeeld (WordPress REST + ACF):
 *   const res = await fetch(`${WP_URL}/wp-json/wp/v2/project?_embed`, { next: { revalidate: 3600 } });
 */
export async function getProjects(): Promise<Project[]> {
  return localProjects;
}

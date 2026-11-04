import HeroSequence from "@/components/hero/HeroSequence";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Process from "@/components/sections/Process";
import Why from "@/components/sections/Why";
import Contact from "@/components/sections/Contact";
import { getProjects } from "@/lib/cms";

// Statisch gegenereerd; ververs elk uur wanneer een CMS is gekoppeld.
export const revalidate = 3600;

export default async function HomePage() {
  const projects = await getProjects();
  return (
    <main id="inhoud">
      <HeroSequence />
      <About />
      <Services />
      <Projects projects={projects} />
      <Process />
      <Why />
      <Contact />
    </main>
  );
}

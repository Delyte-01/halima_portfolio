import AboutSection from "@/components/About";
import Certificates from "@/components/Certificate";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/Project";
import Resume from "@/components/Resume";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <main>

      <Hero />
      <AboutSection />
      <Skills />
      <ProjectsSection />
      <Resume />
      <Certificates />
      <Contact />
     
    </main>
  );
}

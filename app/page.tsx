import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import ProjectsTab from "@/components/ProjectsTab";
import Skill from "@/components/Skill";

export default function Home() {
  return (
    <>
    <Hero />  
    <About />
    <Skill />
    <ProjectsTab />
    <Experience />
    <Contact />
    </>
  );
}

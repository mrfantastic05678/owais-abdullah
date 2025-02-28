import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
// import Projects from "@/components/Projects";
import ProjectsTab from "@/components/ProjectsTab";
import Skill from "@/components/Skill";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
    <Hero />  
    <About />
    <Skill />
    {/* <Skills /> */}
    <ProjectsTab />
    {/* <Projects /> */}
    <Experience />
    <Contact />
    </>
  );
}

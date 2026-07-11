"use client";
import AboutSection from "@/components/AboutSection";
import Skill from "@/components/Skill";
import Experience from "@/components/Experience";

const AboutPageContent = () => {
  return (
    <>
      <h1 className="sr-only">About Owais Abdullah — Spec-Driven Developer & AI Engineer</h1>
      <AboutSection />
      <Experience />
      <Skill />
    </>
  );
};

export default AboutPageContent;

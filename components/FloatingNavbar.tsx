import React from "react";
import { FloatingNav } from "./ui/FloatingNav";
import { FaUserAlt } from "react-icons/fa";
import { FaEnvelope, FaHome, FaProjectDiagram, FaTools } from "react-icons/fa";

const defaultNavItems: { name: string; link: string; icon: JSX.Element }[] = [
  { name: "HOME", link: "/", icon: <FaHome /> },
  { name: "PROJECTS", link: "/projects", icon: <FaProjectDiagram /> },
  { name: "SKILLS", link: "/skills", icon: <FaTools /> },
];

const FloatingNavbar = () => {
  return (
  <div className="relative  w-full">
  <FloatingNav navItems={defaultNavItems} />
</div>
  )
};

export default FloatingNavbar;

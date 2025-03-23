import React from "react";
import { FloatingNav } from "./ui/FloatingNav";
import { FaHome } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { GiSkills } from "react-icons/gi";
import { IoPerson } from "react-icons/io5";

const defaultNavItems: { name: string; link: string; icon: JSX.Element }[] = [
  { name: "HOME", link: "/", icon: <FaHome /> },
  { name: "ABOUT", link: "/about", icon: <IoPerson /> },
  { name: "PROJECTS", link: "/projects", icon: <GrProjects /> },
  { name: "SKILLS", link: "/skills", icon: <GiSkills /> },

];

const FloatingNavbar = () => {
  return (
  <div className="relative  w-full">
  <FloatingNav navItems={defaultNavItems} />
</div>
  )
};

export default FloatingNavbar;

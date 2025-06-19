import Image from "next/image";
import React from "react";
import Project from "../public/assets/Project.webp";
import Project_1 from "../public/assets/Project (1).webp"
import Project_2 from "../public/assets/Project (2).webp"
import Project_3 from "../public/assets/Project (3).webp"
import Project_4 from "../public/assets/Project (4).webp"
import Project_5 from "../public/assets/Project (5).webp"
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import Link from "next/link";

const Projects = () => {
  return (
    <section id="project" className="max-w-7xl mx-auto scroll-smooth ">
          <div className="mt-20 text-center">
    <h3 className="text-base text-accent font-medium sm:text-lg">See My Previous Work</h3>
    <h2 className="text-5xl text-text font-semibold sm:text-6xl">Projects</h2>
    </div>
      <div className="px-5 py-24">
        <div className="flex flex-wrap -m-4">
          <div className="p-4 md:w-1/3">
            <div className="h-full border-5 shadow-lg shadow-zinc-800 border-gray-800 rounded-lg overflow-hidden bg-zinc-900 hover:scale-105 ease-out duration-300 ">
              <Image
                className="lg:h-48 md:h-36 w-full object-cover object-center"
                src={Project}
                alt="project"
              />
              <div className="p-6">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">
                  WordPress
                </h2>
                <h2 className="title-font text-xl font-medium text-text mb-3">
                  Landscape and Gardening Website
                </h2>
                <p className="leading-relaxed mb-3">
                    Created a website for a leading landscape and gardening service provider, they needed a website that effectively communicated their expertise and attracted new clients.
                </p>
                <div className="group flex items-center flex-wrap">
                  <Link href={"#"} className="text-accent inline-flex items-center md:mb-2 lg:mb-0 group-hover:text-text">
                    Learn More
                    <span className="ml-3">
                    <FaRegArrowAltCircleRight />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 md:w-1/3">
            <div className="h-full border-5 shadow-lg shadow-zinc-800 border-gray-800 rounded-lg overflow-hidden bg-zinc-900 hover:scale-105 ease-out duration-300 ">
              <Image
                className="lg:h-48 md:h-36 w-full object-cover object-center"
                src={Project_5}
                alt="project"
              />
              <div className="p-6">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">
                  WordPress
                </h2>
                <h2 className="title-font text-xl font-medium text-text mb-3">
                  One Rupee Raffle Website
                </h2>
                <p className="leading-relaxed mb-3">
                    A new and exciting one-rupee raffle website, their goal was to create a user-friendly and trustworthy platform that stands out in the competitive raffle market.
                </p>
                <div className="group flex items-center flex-wrap">
                  <Link href={"#"} className="text-accent inline-flex items-center md:mb-2 lg:mb-0 group-hover:text-text">
                    Learn More
                    <span className="ml-3">
                    <FaRegArrowAltCircleRight />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 md:w-1/3">
            <div className="h-full border-5 shadow-lg shadow-zinc-800 border-gray-800 rounded-lg overflow-hidden bg-zinc-900 hover:scale-105 ease-out duration-300 ">
              <Image
                className="lg:h-48 md:h-36 w-full object-cover object-center"
                src={Project_2}
                alt="project"
              />
              <div className="p-6">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">
                  WordPress
                </h2>
                <h2 className="title-font text-xl font-medium text-text mb-3">
                Furniture & Interior Design Website
                </h2>
                <p className="leading-relaxed mb-3">
                A renowned furniture store and interior design firm, needed a website that seamlessly blended their exquisite furniture offerings with their design expertise.
                </p>
                <div className="group flex items-center flex-wrap">
                  <Link href={"#"} className="text-accent inline-flex items-center md:mb-2 lg:mb-0 group-hover:text-text">
                    Learn More
                    <span className="ml-3">
                    <FaRegArrowAltCircleRight />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:w-1/3">
            <div className="h-full border-5 shadow-lg shadow-zinc-800 border-gray-800 rounded-lg overflow-hidden bg-zinc-900 hover:scale-105 ease-out duration-300 ">
              <Image
                className="lg:h-48 md:h-36 w-full object-cover object-center"
                src={Project_3}
                alt="project"
              />
              <div className="p-6">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">
                  WordPress
                </h2>
                <h2 className="title-font text-xl font-medium text-text mb-3">
                  Coffee Cafe Website
                </h2>
                <p className="leading-relaxed mb-3">
                A charming coffee cafe, lacked an online presence, their current website wasn&apos;t user-friendly and failed to showcase their unique charm.
                </p>
                <div className="group flex items-center flex-wrap">
                  <Link href={"#"} className="text-accent inline-flex items-center md:mb-2 lg:mb-0 group-hover:text-text">
                    Learn More
                    <span className="ml-3">
                    <FaRegArrowAltCircleRight />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:w-1/3">
            <div className="h-full border-5 shadow-lg shadow-zinc-800 border-gray-800 rounded-lg overflow-hidden bg-zinc-900 hover:scale-105 ease-out duration-300 ">
              <Image
                className="lg:h-48 md:h-36 w-full object-cover object-center"
                src={Project_4}
                alt="project"
              />
              <div className="p-6">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">
                  WordPress
                </h2>
                <h2 className="title-font text-xl font-medium text-text mb-3">
                  Online Quran Academy Website
                </h2>
                <p className="leading-relaxed mb-3">
                A leading online Quran academy, needed a website that effectively communicated their educational offerings and attracted new students. 
                </p>
                <div className="group flex items-center flex-wrap">
                  <Link href={"#"} className="text-accent inline-flex items-center md:mb-2 lg:mb-0 group-hover:text-text">
                    Learn More
                    <span className="ml-3">
                    <FaRegArrowAltCircleRight />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:w-1/3">
            <div className="h-full border-5 shadow-lg shadow-zinc-800 border-gray-800 rounded-lg overflow-hidden bg-zinc-900 hover:scale-105 ease-out duration-300 ">
              <Image
                className="lg:h-48 md:h-36 w-full object-cover object-center"
                src={Project_1}
                alt="project"
              />
              <div className="p-6">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">
                  WordPress
                </h2>
                <h2 className="title-font text-xl font-medium text-text mb-3">
                  Home Improvement Ecommerce Website
                </h2>
                <p className="leading-relaxed mb-3">
                    Many homeowners struggle to find the right tools and gadgets, So I designed a user-friendly store for my client.
                </p>
                <div className="group flex items-center flex-wrap">
                  <Link href={"#"} className="text-accent inline-flex items-center md:mb-2 lg:mb-0 group-hover:text-text">
                    Learn More
                    <span className="ml-3">
                    <FaRegArrowAltCircleRight />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default Projects;

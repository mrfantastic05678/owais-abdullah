import React from "react";
import { BiLogoTypescript } from "react-icons/bi";
import { FaHtml5, FaCss3Alt, FaReact, FaShopify } from "react-icons/fa";
import { MdAutoGraph } from "react-icons/md";

const Skills = () => {
  return (
    <section className="max-w-7xl mx-auto text-gray-400 body-font">
      <div className="px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
          <h3 className="text-base text-accent font-medium sm:text-lg">
            Areas of Expertise
          </h3>
          <h1 className="text-5xl text-text font-semibold sm:text-6xl">
            My Skills
          </h1>
        </div>
        <div className="flex flex-wrap -m-4">

          <div className="xl:w-1/3 md:w-1/2 p-4">
            <div className="group border border-zinc-900 shadow-lg shadow-zinc-900 p-6 rounded-lg hover:shadow-slate-500 hover:shadow-xl hover:bg-blend-darken hover:border-accent">
              <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-gray-600 mb-4">
                <span className="text-3xl group-hover:text-[#264de4]">
                  <FaHtml5 />
                </span>
              </div>
              <h2 className="text-lg text-text font-medium title-font mb-2">
                HTML
              </h2>
              <p className="leading-relaxed text-base">
                Building the structural foundation of web pages with HTML.
              </p>
            </div>
          </div>

          <div className="xl:w-1/3 md:w-1/2 p-4">
            <div className="group border border-zinc-900 shadow-lg shadow-zinc-900 p-6 rounded-lg hover:shadow-slate-500 hover:shadow-xl hover:bg-blend-darken hover:border-accent">
              <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-gray-600 mb-4">
                <span className="text-3xl group-hover:text-red-500">
                  <FaCss3Alt />
                </span>
              </div>
              <h2 className="text-lg text-text font-medium title-font mb-2">
                CSS
              </h2>
              <p className="leading-relaxed text-base">
                Styling and laying out web pages with CSS for a visually
                appealing user experience.
              </p>
            </div>
          </div>

          <div className="xl:w-1/3 md:w-1/2 p-4">
            <div className="group border border-zinc-900 shadow-lg shadow-zinc-900 p-6 rounded-lg hover:shadow-slate-500 hover:shadow-xl hover:bg-blend-darken hover:border-accent">
              <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-gray-600 mb-4">
                <span className="text-3xl group-hover:text-[#007acc]">
                  <BiLogoTypescript />
                </span>
              </div>
              <h2 className="text-lg text-text font-medium title-font mb-2">
                JavaScript/TypeScript
              </h2>
              <p className="leading-relaxed text-base">
                Creating dynamic and interactive web applications for a seamless
                user experience.
              </p>
            </div>
          </div>

          <div className="xl:w-1/3 md:w-1/2 p-4">
            <div className="group border border-zinc-900 shadow-lg shadow-zinc-900 p-6 rounded-lg hover:shadow-slate-500 hover:shadow-xl hover:bg-blend-darken hover:border-accent">
              <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-gray-600 mb-4">
                <span className="text-3xl group-hover:text-[#61DBFB]">
                  <FaReact />
                </span>
              </div>
              <h2 className="text-lg text-text font-medium title-font mb-2">
                ReactJs/NextJs
              </h2>
              <p className="leading-relaxed text-base">
                Developing efficient and scalable front-end applications with
                React and Next.js for a faster and more responsive user
                interface.
              </p>
            </div>
          </div>

          <div className="xl:w-1/3 md:w-1/2 p-4">
            <div className="group border border-zinc-900 shadow-lg shadow-zinc-900 p-6 rounded-lg hover:shadow-slate-500 hover:shadow-xl hover:bg-blend-darken hover:border-accent">
              <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-gray-600 mb-4">
                <span className="text-3xl group-hover:text-[#96bf48]">
                  <FaShopify />
                </span>
              </div>
              <h2 className="text-lg text-text font-medium title-font mb-2">
                WordPress/Shopify
              </h2>
              <p className="leading-relaxed text-base">
                Building and customizing WordPress websites & Shopify Stores to
                create powerful and flexible online platforms.
              </p>
            </div>
          </div>

          <div className="xl:w-1/3 md:w-1/2 p-4">
            <div className="group border border-zinc-900 shadow-lg shadow-zinc-900 p-6 rounded-lg hover:shadow-slate-500 hover:shadow-xl hover:bg-blend-darken hover:border-accent">
              <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-gray-600 mb-4">
                <span className="text-3xl group-hover:text-red-600">
                  <MdAutoGraph />{" "}
                </span>
              </div>
              <h2 className="text-lg text-text font-medium title-font mb-2">
                Digital Marketing
              </h2>
              <p className="leading-relaxed text-base">
                Driving online growth through strategic SEO, PPC, content
                marketing, and social media campaigns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;

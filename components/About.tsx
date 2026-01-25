"use client";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="max-w-7xl mx-auto text-gray-600 body-font scroll-smooth">
      <div
        id="about"
        className="px-5 py-24 grid content-center scroll-smooth duration-300"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-base text-center md:text-left text-accent font-medium sm:text-lg">
            About Me!
          </h3>
          <h2 className="sm:text-3xl text-center text-2xl md:text-left text-foreground font-medium title-font mb-2 md:w-2/5">
            Spec-Driven Developer & AI Engineer
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:-mt-24 md:w-3/5 md:pl-6 justify-self-end"
        >
          <p className="leading-relaxed text-center md:text-left text-base text-gray-500">
            I am a <span className="text-accent font-semibold">spec-driven developer</span> and <span className="text-accent font-semibold">AI engineer</span> specializing in Next.js SaaS products and full-time digital solutions. I build production-ready web applications and AI agents using <span className="text-accent font-semibold">AI-driven engineering</span> practices, from writing clear specifications before coding to implementing intelligent automation with the OpenAI Agents SDK. Passionate about creating scalable architectures that help businesses grow through technology.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center md:justify-start md:mt-4 mt-6"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex font-semibold text-white bg-gradient-to-br from-blue-900 via-accent to-blue-700 hover:from-blue-950 hover:bg-blue-500 hover:bg-gradient-to-tr border-0 py-2 px-4 focus:outline-none rounded-full"
              >
                Contact Me
              </motion.button>
            </Link>
            <Link
              href={"/projects"}
              className="group text-accent-500 inline-flex items-center ml-4"
            >
              Learn More
              <motion.span
                className="group-hover:rotate-90 ml-5 duration-300 group-hover:text-accent inline-block"
              >
                <FaArrowRight />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

import Image from "next/image";
import React from "react";
import Link from "next/link";
import contactimg from "../public/assets/contact.png";

const Contact = () => {
  return (
    <section className="max-w-7xl mx-auto text-gray-400 body-font relative px-4 py-24">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2 w-full opacity-90 rounded-lg overflow-hidden px-5 py-10 bg-gradient-to-br to-[#1c1f22] from-[#16161f]">
          <Image
            src={contactimg}
            alt="contact"
            className="rounded-md mb-5 object-cover w-full h-52 md:h-64"
          />
          <h2 className="font-semibold text-text text-2xl sm:text-3xl">
            OWAIS ABDULLAH
          </h2>
          <div className="mt-4 space-y-2">
            <div>
              <h2 className="font-semibold text-text text-xs">ADDRESS</h2>
              <p className="mt-1">Karachi, Pakistan</p>
            </div>
            <div>
              <h2 className="title-font font-semibold text-text text-xs">
                EMAIL
              </h2>
              <Link
                href="mailto:owais@oneklickdigi.com"
                className="text-accent leading-relaxed"
              >
                owais@oneklickdigi.com
              </Link>
            </div>
            <div>
              <h2 className="title-font font-semibold text-text text-xs">
                PHONE
              </h2>
              <Link href={"tel:+923262283140"}>
                <p className="leading-relaxed">+923262283140</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 w-full bg-background flex flex-col md:ml-auto md:py-8 mt-8 md:mt-0 font-montserrat">
          <h2 className="text-text text-2xl mb-1 font-semibold title-font">
            CONNECT WITH ME
          </h2>
          <form action="https://formspree.io/f/xnnqvnzl" method="POST">
            <div className="relative mb-4 ">
              <label htmlFor="name" className="leading-7 text-sm text-gray-400">
                NAME
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full shadow-inner shadow-zinc-900 bg-zinc-800 rounded border border-gray-900 focus:border-accent focus:ring-1 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-400"
              >
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full shadow-inner shadow-zinc-900 bg-zinc-800 rounded border border-gray-900 focus:border-accent focus:ring-1 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="subject"
                className="leading-7 text-sm text-gray-400"
              >
                SUBJECT
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full shadow-inner shadow-zinc-900 bg-zinc-800 rounded border border-gray-900 focus:border-accent focus:ring-1 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-400"
              >
                MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full shadow-inner shadow-zinc-900 bg-zinc-800 rounded border border-gray-900 focus:border-accent focus:ring-1 h-36 text-base outline-none text-gray-400 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                defaultValue={""}
                required
              />
            </div>
            <button className="w-full text-white bg-gradient-to-br from-blue-400 via-accent to-blue-400 from-[0%] via-[10%] border-0 py-4 px-6 focus:outline-none hover:bg-text hover:scale-105 duration-300 ease-out rounded text-md font-semibold">
              SEND MESSAGE
            </button>
          </form>
          <p className="text-xs text-center text-gray-500 mt-5">
            Send me a message, and I&apos;ll contact you shortly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;

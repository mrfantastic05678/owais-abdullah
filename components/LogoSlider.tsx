"use client";

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { memo } from "react";

const logos = [
  "/assets/clients/logo (1).webp",
  "/assets/clients/logo (2).webp",
  "/assets/clients/logo (3).webp",
  "/assets/clients/logo (4).webp",
  "/assets/clients/logo (5).webp",
  "/assets/clients/logo (6).webp",
  "/assets/clients/logo (7).webp",
  "/assets/clients/logo (8).webp",
  "/assets/clients/logo (9).webp",
  "/assets/clients/logo (10).webp",
  "/assets/clients/logo (11).webp",
  "/assets/clients/logo (12).webp",
];

const LogoImage = memo(
  ({ src, index }: { src: string | StaticImport; index: number }) => (
    <Image
      key={index}
      src={src}
      alt={`Client logo ${(index % logos.length) + 1}`}
      width={300}
      height={150}
      className="mx-0 h-12 w-auto object-contain grayscale transition-all 
      hover:grayscale-0 dark:opacity-80 dark:hover:opacity-100"
      loading="lazy"
      sizes="(max-width: 640px) 150px, 300px"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/assets/logo-192.png";
      }}
    />
  )
);
LogoImage.displayName = "LogoImage";

export default function LogoSlider() {
  return (
    <section className="relative -mt-[90px] py-4 bg-[#1d212b] will-change-transform">
      <div className="max-w-[1500px] mx-auto">
        <div className="overflow-hidden">
          <div className="w-max flex flex-nowrap slider">
            {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
              <LogoImage key={index} src={logo} index={index} />
            ))}
          </div>
        </div>

        {/* Gradient fade edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1d212b]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#1d212b]/50 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

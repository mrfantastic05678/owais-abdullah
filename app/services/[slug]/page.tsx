import { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import JsonLdSchema from "@/components/JsonLdSchema";
import ServiceTechStack from "@/components/ServiceTechStack";
import ServiceHeroContent from "@/components/ServiceHeroContent";
import ServiceFAQ from "@/components/ServiceFAQ";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services[slug];

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title} | Owais Abdullah`,
    description: service.description,
    keywords: [
      ...service.features,
      ...service.techStack,
      service.tagline,
      "Owais Abdullah",
      "AI Developer",
      "Next.js Developer",
      "SaaS Development",
    ],
    openGraph: {
      title: `${service.title} | Owais Abdullah`,
      description: service.description,
      url: `https://owaisabdullah.dev/services/${slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://owaisabdullah.dev/services/${slug}`,
    },
  };
}

// Generate static params for all services
export async function generateStaticParams() {
  return Object.values(services).map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services[slug];

  if (!service) {
    notFound();
  }

  return (
    <>
      <JsonLdSchema
        type="service"
        pageUrl={`https://owaisabdullah.dev/services/${service.slug}`}
        faqs={service.faqs}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <ServiceHeroContent
          title={service.title}
          tagline={service.tagline}
          longDescription={service.longDescription}
          iconName={service.icon}
          gradient={service.gradient}
        />

        {/* Features Section */}
        <section className="py-20 border-t border-border/40">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center mb-12">
              <span className="text-teal-600 dark:text-teal-400 font-mono text-xs tracking-widest uppercase mb-2 block">
                Deliverables &amp; Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                What&apos;s Included
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {service.features.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#081B1E] border border-slate-200/90 dark:border-[#10343A] shadow-xs hover:border-teal-500/50 hover:shadow-md transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-foreground text-sm font-semibold tracking-tight leading-snug block">
                        {feature}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-teal-700 dark:text-teal-400/90 px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <ServiceTechStack techStack={service.techStack} />

        {/* Process Section */}
        <section className="py-20 border-t border-border/40">
          <div className="max-w-7xl mx-auto px-5">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              How It Works
            </h2>
            <div className="max-w-4xl mx-auto">
              {service.process.map((step, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex items-start gap-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#081B1E] border border-slate-200/90 dark:border-[#10343A] shadow-sm hover:border-teal-500/40 hover:shadow-md transition-all">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 text-white flex items-center justify-center font-bold font-mono text-base sm:text-lg shadow-md ring-1 ring-teal-500/20">
                      {step.step < 10 ? `0${step.step}` : step.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < service.process.length - 1 && (
                    <div className="ml-11 w-0.5 h-6 bg-border/60 my-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        {service.pricing && (
          <section id="pricing" className="py-20 border-t border-border/40">
            <div className="max-w-7xl mx-auto px-5">
              <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
                Pricing
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Transparent pricing tailored to your needs. Contact me for a
                custom quote.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
                {service.pricing.map((tier, index) => (
                  <div
                    key={index}
                    className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between bg-white dark:bg-[#081B1E] ${
                      tier.highlighted
                        ? "border-2 border-teal-500 shadow-xl shadow-teal-500/15 relative md:-translate-y-2"
                        : "border border-slate-200/90 dark:border-[#10343A] shadow-md hover:border-teal-500/40 hover:shadow-xl"
                    }`}
                  >
                    <div>
                      {tier.highlighted && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[11px] font-mono font-bold rounded-full tracking-wider shadow-sm uppercase">
                          MOST POPULAR
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {tier.name}
                      </h3>
                      <div className="mb-6">
                        <span className="text-3xl sm:text-4xl font-bold text-foreground">
                          {tier.price}
                        </span>
                        {tier.period && (
                          <span className="text-muted-foreground text-sm ml-2 font-mono">
                            /{tier.period}
                          </span>
                        )}
                      </div>
                      <ul className="space-y-3 mb-8">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mr-2.5 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link href="#contact" className="block w-full">
                      <button
                        className={`group w-full py-2.5 rounded-xl font-medium transition-all text-sm cursor-pointer ${
                          tier.highlighted
                            ? "bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white shadow-md hover:opacity-95"
                            : "border border-slate-200 dark:border-teal-900/60 bg-slate-100 hover:bg-slate-200 dark:bg-[#05181b] dark:hover:bg-teal-900/40 text-foreground font-semibold shadow-2xs"
                        }`}
                      >
                        <SplitFlapLabel primary="Get Started" secondary="Select Plan" />
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {service.faqs && service.faqs.length > 0 && <ServiceFAQ faqs={service.faqs} />}

        {/* CTA Section */}
        <section id="contact" className="py-20">
          <div className="max-w-4xl mx-auto px-5 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let&apos;s discuss your project and how I can help you achieve your
              goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <button className="group inline-flex items-center justify-center px-7 sm:px-8 py-3.5 text-white bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:opacity-95 rounded-md font-medium transition-all shadow-md cursor-pointer">
                  <SplitFlapLabel primary="Contact Me" secondary="Book Spec Call" className="min-w-[7.5rem]" />
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a
                href="mailto:mrowaisabdullah@gmail.com"
                className="group inline-flex items-center justify-center px-7 sm:px-8 py-3.5 text-foreground bg-card hover:bg-teal-500/10 border border-border hover:border-teal-500 rounded-md font-medium transition-all cursor-pointer min-w-[10rem]"
              >
                <SplitFlapLabel primary="Email Me" secondary="Send Direct Msg" className="min-w-[8rem]" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

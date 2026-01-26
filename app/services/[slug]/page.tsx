import { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import JsonLdSchema from "@/components/JsonLdSchema";
import ServiceTechStack from "@/components/ServiceTechStack";
import ServiceHeroContent from "@/components/ServiceHeroContent";
import ServiceFAQ from "@/components/ServiceFAQ";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

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
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <ServiceHeroContent
          title={service.title}
          tagline={service.tagline}
          longDescription={service.longDescription}
          iconName={service.icon}
          gradient={service.gradient}
        />

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-5">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              What&apos;s Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-card rounded-lg border border-border"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <ServiceTechStack techStack={service.techStack} />

        {/* Process Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-5">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              How It Works
            </h2>
            <div className="max-w-4xl mx-auto">
              {service.process.map((step, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <div className="flex items-start gap-6">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {step.step}
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < service.process.length - 1 && (
                    <div className="ml-6 w-0.5 h-8 bg-border mt-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        {service.pricing && (
          <section id="pricing" className="py-20">
            <div className="max-w-7xl mx-auto px-5">
              <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
                Pricing
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Transparent pricing tailored to your needs. Contact me for a
                custom quote.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {service.pricing.map((tier, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 ${
                      tier.highlighted
                        ? "border-accent bg-accent/5 relative"
                        : "border-border bg-card"
                    }`}
                  >
                    {tier.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-bold rounded-full">
                        MOST POPULAR
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {tier.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-foreground">
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="text-muted-foreground ml-2">
                          /{tier.period}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-accent mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="#contact">
                      <button
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          tier.highlighted
                            ? "bg-accent text-white hover:bg-accent/90"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        Get Started
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
                <button className="group inline-flex items-center px-8 py-3 text-white bg-gradient-to-br from-blue-900 via-accent to-blue-700 hover:from-blue-950 rounded-full font-medium transition-all">
                  Contact Me
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a
                href="mailto:mrowaisabdullah@gmail.com"
                className="inline-flex items-center px-8 py-3 text-foreground bg-card hover:bg-accent hover:text-white border-2 border-border hover:border-accent rounded-full font-medium transition-all"
              >
                Email Me
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

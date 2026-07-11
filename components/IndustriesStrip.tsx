// Verticals with a real shipped project behind each (see data/profile.ts)
const INDUSTRIES = [
  "E-commerce",
  "Education & E-learning",
  "Restaurants",
  "Travel",
  "HR & Recruitment",
  "Marketing Agencies",
  "Furniture Retail",
  "Freelance & Services",
];

export default function IndustriesStrip() {
  return (
    <section className="border-b border-border">
      <div className="max-w-7xl mx-auto px-5 py-12 text-center">
        <span className="text-accent font-mono text-xs tracking-widest uppercase mb-4 block">
          Industries shipped for
        </span>
        <ul className="flex flex-wrap justify-center gap-3">
          {INDUSTRIES.map((name) => (
            <li
              key={name}
              className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md bg-card/40"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

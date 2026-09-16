import { Metadata } from "next";
import InsightsClient from "@/app/insights-0786/InsightsClient";

export const metadata: Metadata = {
  title: "Private Analytics & Insights Vault | Owais Abdullah",
  description: "Private analytics portal for blog metrics, user engagement, and Octively AI promo banner A/B performance.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminInsightsPage() {
  return <InsightsClient />;
}

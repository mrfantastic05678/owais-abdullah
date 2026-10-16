import { Metadata } from "next";
import InsightsAdminClient from "./InsightsAdminClient";

export const metadata: Metadata = {
  title: "Analytics Vault | Admin Suite",
  description: "Private analytics portal for blog metrics, user engagement, audience geography, and Octively AI promo performance.",
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
  return <InsightsAdminClient />;
}

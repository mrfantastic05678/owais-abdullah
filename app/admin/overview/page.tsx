import { Metadata } from "next";
import OverviewAdminClient from "./OverviewAdminClient";

export const metadata: Metadata = {
  title: "Admin Mission Control & Overview | Owais Abdullah",
  description: "Overview of inbound store submissions, merchant claims, discussions, and live telemetry.",
  robots: { index: false, follow: false },
};

export default function AdminOverviewPage() {
  return <OverviewAdminClient />;
}

import { Metadata } from "next";
import CacheAdminClient from "./CacheAdminClient";

export const metadata: Metadata = {
  title: "Cache & Webhook Manager Vault | Owais Abdullah",
  description: "Purge Next.js ISR cache and trigger instant revalidations.",
  robots: { index: false, follow: false },
};

export default function AdminCachePage() {
  return <CacheAdminClient />;
}

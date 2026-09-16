import { Metadata } from "next";
import StoresAdminClient from "./StoresAdminClient";

export const metadata: Metadata = {
  title: "Directory & Stores Admin Vault | Owais Abdullah",
  description: "Private management dashboard to review store submissions, confirm claims, and manage listings.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminStoresPage() {
  return <StoresAdminClient />;
}

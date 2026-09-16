import type { Metadata } from "next";
import AdminDashboardShell from "@/components/admin/AdminDashboardShell";

export const metadata: Metadata = {
  title: "Admin Suite | Owais Abdullah",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}

import { Metadata } from "next";
import ChatsAdminClient from "./ChatsAdminClient";

export const metadata: Metadata = {
  title: "Otto AI Sessions Vault | Admin Mission Control",
  description: "Inspect full transcript histories, voice logs, and client intake leads from Otto AI.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminChatsPage() {
  return <ChatsAdminClient />;
}

import { Metadata } from "next";
import CommentsAdminClient from "./CommentsAdminClient";

export const metadata: Metadata = {
  title: "Blog Comments Moderation Vault | Owais Abdullah",
  description: "Review, approve, hide, edit, and reply to readers' comments.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminCommentsPage() {
  return <CommentsAdminClient />;
}

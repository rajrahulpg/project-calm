import type { Metadata } from "next";
import AdminPanel from "@/components/AdminPanel";

// Not linked from anywhere on the site, and kept out of search engines.
export const metadata: Metadata = {
  title: "Admin — Project CALM",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}

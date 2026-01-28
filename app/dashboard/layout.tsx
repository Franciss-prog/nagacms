import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export const metadata = {
  title: "Dashboard - Barangay Health System",
};

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect dashboard routes - redirect to login if not authenticated
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <DashboardLayout user={session.user}>{children}</DashboardLayout>;
}

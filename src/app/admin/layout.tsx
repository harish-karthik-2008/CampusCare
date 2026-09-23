import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If no user session or not admin, redirect
  if (!user) {
    redirect("/login?role=admin");
  }

  // If student tries to access admin routes, redirect to student dashboard with error
  if (user.role !== "ADMIN") {
    redirect("/student/dashboard?error=unauthorized_admin");
  }

  return <AppShell user={user}>{children}</AppShell>;
}

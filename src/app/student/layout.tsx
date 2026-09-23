import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If no user session, redirect to login
  if (!user) {
    redirect("/login?role=student");
  }

  return <AppShell user={user}>{children}</AppShell>;
}

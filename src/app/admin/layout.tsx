import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

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

  return (
    <div className="min-h-screen bg-campus-bg flex flex-col">
      <Navbar user={user} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-6">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
      <MobileNav role="ADMIN" />
    </div>
  );
}

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

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

  return (
    <div className="min-h-screen bg-campus-bg flex flex-col">
      <Navbar user={user} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-6">
        <Sidebar role="STUDENT" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
      <MobileNav role="STUDENT" />
    </div>
  );
}

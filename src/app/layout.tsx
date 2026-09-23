import type { Metadata } from "next";
import "./globals.css";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "CampusCare — Smart Campus Complaint & Resolution Management System",
  description:
    "Centralized digital platform for college campus students to submit complaints and track resolutions, with comprehensive administration workflow, assignment, and real-time analytics.",
  icons: {
    icon: "/campuscare-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-campus-bg text-campus-text antialiased selection:bg-purple-200 selection:text-purple-900">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

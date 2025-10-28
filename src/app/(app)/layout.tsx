
"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col"> {/* Removed overflow-hidden */}
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 pt-6 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

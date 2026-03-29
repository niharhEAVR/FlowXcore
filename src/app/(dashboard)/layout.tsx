import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import AppSidebar from "@/components/created-ui/app-sidebar";

import { requireAuth } from "@/lib/auth-utils";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    await requireAuth();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-accent/20">
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}

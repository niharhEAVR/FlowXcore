import AppHeader from "@/components/created-ui/app-header";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <>
        <AppHeader/>
        <main className="flex-1">{ children }</main>
        </>
    );
}

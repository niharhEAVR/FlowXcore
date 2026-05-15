"use client"

import {
    CreditCardIcon,
    FolderOpenIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    StarIcon
} from "lucide-react"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"

import { authClient } from "@/lib/auth-client"
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription"

const menuItems = [
    {
        title: "Main",
        items: [
            { title: "Workflows", icon: FolderOpenIcon, url: "/workflows" },
            { title: "Credentials", icon: KeyIcon, url: "/credentials" },
            { title: "Executions", icon: HistoryIcon, url: "/executions" },
        ]
    }
]

const AppSidebar = () => {

    const router = useRouter();
    const pathName = usePathname();

    const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
    

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4 h-10 px-4" tooltip={"FlowXcore"}>
                        <Link prefetch href={"/workflows"}>
                            <Image src={"/logo.svg"} alt="flowXcore" height={30} width={30}></Image>
                            <span className="font-semibold text-sm">FlowXcore</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>


            <SidebarContent>
                {menuItems.map(group => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map(item => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={item.url === "/" ? pathName === "/" : pathName.startsWith(item.url)}
                                            asChild
                                            className="gap-x-4 h-10 px-4"
                                        >
                                            <Link href={item.url} prefetch>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>


            <SidebarFooter>
                <SidebarMenu>
                    {!hasActiveSubscription && !isLoading && (<SidebarMenuButton
                        tooltip="Upgrade to Pro"
                        className="gap-x-4 h-10 px-4"
                        onClick={async () => {
                            try {
                                const res = await authClient.checkout({ slug: "FlowXcore" }); // this slug should match with the one defined in the polar dashboard
                            } catch (err) {
                                console.error(err);
                            }
                        }}
                    >
                        <StarIcon className="h-4 w-4" />
                        <span>Upgrade to Pro</span>
                    </SidebarMenuButton>)}

                    <SidebarMenuButton
                        tooltip="Billing Portal"
                        className="gap-x-4 h-10 px-4"
                        onClick={async () => {
                            try {
                                const res = await authClient.customer.portal();
                                console.log(res);
                            } catch (err) {
                                console.error(err);
                            }
                        }}
                    >
                        <CreditCardIcon className="h-4 w-4" />
                        <span>Billing Portal</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton tooltip={"Log Out"} className="gap-x-4 h-10 px-4" onClick={async () => {
                        await authClient.signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    router.push('/login');
                                }
                            }
                        });
                    }}>
                        <LogOutIcon className="h-4 w-4"></LogOutIcon>
                        <span>Log Out</span>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar;
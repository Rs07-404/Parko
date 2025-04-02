"use client";
import React from "react";
import { redirect, usePathname } from "next/navigation";
import Loading from "@/app/loading";
import { AuthRoutes, publicURL } from "@/lib/routes";
import Header from "./app-header";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SideBarContent } from "@/components/ui/sidebarContent";
import { useMounted } from "@/hooks/use-mounted";
import AuthLayout from "@/components/Auth/Layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicURL = publicURL.includes(pathname);
    const isAuthURL = AuthRoutes.includes(pathname);
    const isMounted = useMounted();
    // const { session, isLoading } = useSession();

    if (!isMounted) {
        return <Loading />
    }

    if (isAuthURL) {
        return <AuthLayout>{children}</AuthLayout>
    }

    if (isPublicURL) {
        return <React.Fragment>
            {children}
            </React.Fragment>;
    }

    if (pathname === "/" /* && session.isLoggedIn*/) {
        redirect('/home');
    }

    if (!isPublicURL /*&& session.isLoggedIn*/) {
        return (
            <SidebarProvider>
                <Sidebar collapsible="icon" className="pt-16 bg-card dark:border-none">
                    <SideBarContent />
                </Sidebar>
                <Header>
                    <SidebarTrigger />
                </Header>
                <main className="w-full px-2">
                    {children}
                </main>
            </SidebarProvider>

        )
    }
}
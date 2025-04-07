"use client";
import React, { useEffect } from "react";
import { redirect, usePathname } from "next/navigation";
import Loading from "@/app/loading";
import { AuthRoutes, ProtectedRoutes, PublicRoutes, TestRoutes } from "@/lib/routes";
import Header from "./app-header";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SideBarContent } from "@/components/ui/sidebarContent";
import { useMounted } from "@/hooks/use-mounted";
import AuthLayout from "@/components/Auth/Layout";
import { useAuthContext } from "@/context/auth-context";
import PageNotFound from "@/components/ErrorPages/PageNotFound";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicURL = PublicRoutes.includes(pathname ?? "");
    const isAuthURL = AuthRoutes.includes(pathname ?? "");
    const isTestURL = TestRoutes.includes(pathname ?? "");
    const isProtectedURL = !isPublicURL && !isAuthURL && ProtectedRoutes.includes(pathname ?? "");
    const { authUser, authLoading } = useAuthContext();
    const isMounted = useMounted();
    // const { session, isLoading } = useSession();
    useEffect(() => {
        if (!authLoading) {
            if (isAuthURL && authUser) {
                redirect("/home");
            }

            if (isProtectedURL && !authUser) {
                redirect('/login');
            }
        }
    }, [authUser])

    if (!isMounted || authLoading) {
        return <Loading />
    }

    if (pathname === "/" || pathname === null) {
        if (authUser) {
            redirect("/home");
        }
        redirect("/login");
    }

    if (isPublicURL) {
        return <React.Fragment>
            {children}
        </React.Fragment>;
    }

    if (isTestURL) {
        return (<SidebarProvider>
            <Sidebar collapsible="icon" className="pt-16 bg-card dark:border-none">
                <SideBarContent />
            </Sidebar>
            <Header />
            {/* <SidebarTrigger /> */}
            {/* </Header> */}
            <main className="w-full">
                {children}
            </main>
        </SidebarProvider>)
    }



    if (isAuthURL && !authUser) {
        return <AuthLayout>{children}</AuthLayout>
    }


    if (!isPublicURL && isProtectedURL && authUser) {
        return (
            <SidebarProvider>
                <Sidebar collapsible="icon" className="pt-16 bg-card dark:border-none">
                    <SideBarContent />
                </Sidebar>
                <Header />
                {/* <SidebarTrigger /> */}
                {/* </Header> */}
                <main className="w-full">
                    {children}
                </main>
            </SidebarProvider>

        )
    }

    return <PageNotFound />;
}
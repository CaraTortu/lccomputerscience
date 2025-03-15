import { type ReactNode } from "react";
import AdminNavbar from "~/app/_components/nav/admin/adminNavbar";
import NavBar from "../_components/nav/mainNavbar";
import { SidebarProvider, SidebarTrigger } from "../_components/ui/sidebar";
import { auth } from "~/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session?.user.role !== "admin") {
        return redirect("/content")
    }

    return (
        <div>
            <NavBar />
            <SidebarProvider>
                <div className="w-full flex">
                    <AdminNavbar />
                    <div className="w-full flex flex-col p-4 pt-20 gap-4">
                        <SidebarTrigger className="hidden md:flex" />
                        {children}
                    </div>
                </div>
            </SidebarProvider>
        </div>
    )
}

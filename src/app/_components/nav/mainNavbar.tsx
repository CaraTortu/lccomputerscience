"use server"

import Link from "next/link";
import { auth } from "~/server/auth"
import { NavUser } from "./nav-user";
import { ThemeToggle } from "../theme/theme-toggle";
import { navbarLinks } from "~/constants";
import MobileNav from "./nav-mobile";
import { headers } from "next/headers";
import { webConfig } from "~/lib/toggles";

export default async function NavBar() {
    const session = await auth.api.getSession({
        headers: await headers(),
        query: {
            disableCookieCache: true
        }
    })

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-24 fixed backdrop-blur-lg top-0 h-16 w-full bg-background/60 text-sidebar-foreground px-4 border-b-2 border-primary font-sans z-30">
                <Link href="/" className="h-16 flex items-center pl-4">
                    <div className="flex items-center gap-2">
                        <div className="relative size-8 bg-purple-700 rounded-md text-white font-bold text-lg flex items-center justify-center shadow-lg">
                            <span className="animate-pulse">L</span>
                            <span className="absolute top-1 left-5 text-xs text-purple-300 animate-bounce">C</span>
                        </div>
                        <div className="text-white font-extrabold text-2xl tracking-tight">
                            <span className="text-purple-400">Computer</span><span className="text-purple-200">Science</span>
                        </div>
                    </div>
                </Link>
                <div className="grow w-full flex items-center font-bold text-sidebar-foreground *:duration-100 gap-12">
                    {navbarLinks.filter(link => !link.hideIfLoggedIn && !link.adminOnly).map((link) => (
                        <Link key={link.url} href={link.url} className="dark:hover:text-gray-300 hover:text-gray-600" prefetch={link.prefetch}>{link.name}</Link>
                    ))}
                    {!session && navbarLinks.filter(link => link.hideIfLoggedIn).map((link) => (
                        <Link key={link.url} href={link.url} className="dark:hover:text-gray-300 hover:text-gray-600" prefetch={link.prefetch}>{link.name}</Link>
                    ))}
                    {session?.user.role === "admin" && navbarLinks.filter(link => link.adminOnly).map((link) => (
                        <Link key={link.url} href={link.url} className="dark:hover:text-gray-300 hover:text-gray-600" prefetch={link.prefetch}>{link.name}</Link>
                    ))}
                </div>
                <div className="flex gap-4">
                    {session && <NavUser user={session.user} />}
                    {webConfig.multiTheme && <ThemeToggle />}
                </div>
            </div>

            {/* Mobile */}
            <div className="fixed top-5 left-5 md:hidden z-50">
                <MobileNav session={session} />
            </div>
        </>
    )
}

"use server"

import Image from "next/image";
import Link from "next/link";
import { auth } from "~/server/auth"
import { NavUser } from "./nav-user";
import { ThemeToggle } from "../theme/theme-toggle";
import { navbarLinks } from "~/constants";
import MobileNav from "./nav-mobile";
import { headers } from "next/headers";

export default async function NavBar() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-20 fixed backdrop-blur-lg top-0 h-16 w-full bg-background/60 text-sidebar-foreground px-4 border-b-2 border-primary font-sans z-30">
                <Link href="/" className="h-16 flex items-center">
                    <Image src="/images/toplogo.png" alt="LC Computer Science" width={300} height={60} />
                </Link>
                <div className="grow w-full flex items-center font-bold text-sidebar-foreground *:duration-100 gap-12">
                    {navbarLinks.filter(link => !link.hideIfLoggedIn && !link.adminOnly).map((link) => (
                        <Link key={link.url} href={link.url} className="dark:hover:text-gray-300 hover:text-gray-600">{link.name}</Link>
                    ))}
                    {!session && navbarLinks.filter(link => link.hideIfLoggedIn).map((link) => (
                        <Link key={link.url} href={link.url} className="dark:hover:text-gray-300 hover:text-gray-600">{link.name}</Link>
                    ))}
                    {session?.user.role === "admin" && navbarLinks.filter(link => link.adminOnly).map((link) => (
                        <Link key={link.url} href={link.url} className="dark:hover:text-gray-300 hover:text-gray-600">{link.name}</Link>
                    ))}
                </div>
                <div className="flex gap-4">
                    {session && <NavUser user={session.user} />}
                    <ThemeToggle />
                </div>
            </div>

            {/* Mobile */}
            <div className="fixed top-5 left-5 md:hidden">
                <MobileNav session={session} />
            </div>
        </>
    )
}

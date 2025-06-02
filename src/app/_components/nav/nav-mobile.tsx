"use client"

import { MenuIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../ui/sheet"
import Image from "next/image"
import { ThemeToggle } from "../theme/theme-toggle"
import { adminLinks, navbarLinks } from "~/constants"
import Link from "next/link"
import {
    BadgeCheck,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "~/app/_components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { type Session, type User } from "~/server/auth"
import { authClient } from "~/lib/auth-client"
import { toast } from "sonner"

function MobileUserNav({ user, setNavOpen }: { user: User, setNavOpen: (open: boolean) => void }) {

    const router = useRouter()

    const logout = async () => {
        setNavOpen(false)
        // By default, it refreshed the entire site which removes the toast.
        // By doing it this way the toast is not removed.
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logged out!", {
                        description: "You have been logged out successfully",
                        duration: 2000,
                    })

                    router.refresh()
                }
            }
        })
    }

    const handleBilling = async () => {
        return;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="grow" asChild>
                <Button variant="outline" size="lg" className="px-2 h-full flex gap-4">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.image!} alt="Profile picture" />
                        <AvatarFallback className="rounded-full">{user.name?.slice(0, 2) ?? user.email?.slice(0, 2) ?? "UR"}</AvatarFallback>
                    </Avatar>
                    {user.name ? (
                        <div className="flex flex-col">
                            <p>{user.name}</p>
                            <p className="text-xs">{user.email}</p>
                        </div>
                    ) : (
                        <p>{user.email}</p>
                    )}
                    <div className="grow flex items-center justify-end">
                        <ChevronsUpDown className="size-4" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-(--radix-dropdown-menu-trigger-width)" align="end" sideOffset={4}>
                {user.tier === "free" && (
                    <>
                        <DropdownMenuGroup>
                            <Link href="/pricing" onClick={() => setNavOpen(false)}>
                                <DropdownMenuItem>
                                    <Sparkles />
                                    Upgrade Account
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuGroup>
                    <Link href="/account" onClick={() => setNavOpen(false)}>
                        <DropdownMenuItem>
                            <BadgeCheck />
                            Account
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => handleBilling()}>
                        <CreditCard />
                        Billing
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}

export default function MobileNav({ session }: { session: Session | null }) {
    const [navOpen, setNavOpen] = useState(false)
    const path = usePathname()

    return (
        <Sheet open={navOpen} onOpenChange={(open) => setNavOpen(open)}>
            <SheetTrigger asChild>
                <Button size="icon" className="flex items-center">
                    <MenuIcon />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-sidebar text-sidebar-foreground">
                <SheetTitle className="flex w-full justify-center">
                    <Image src="/images/toplogo.png" alt="LC Computer Science" width={250} height={100} />
                </SheetTitle>
                <SheetDescription></SheetDescription>
                <div className="flex flex-col grow gap-4">
                    <div className="grow flex flex-col gap-4">
                        {navbarLinks.filter(link => !link.hideIfLoggedIn && !link.adminOnly).map((link) => (
                            <Link key={link.url} href={link.url} className="dark:hover:text-gray-300 hover:text-gray-600" onClick={() => setNavOpen(false)} prefetch={link.prefetch}>{link.name}</Link>
                        ))}
                        {!session && navbarLinks.filter(link => link.hideIfLoggedIn && !link.adminOnly).map((link) => (
                            <Link key={link.url} href={link.url} className="dark:hover:text-gray-300 hover:text-gray-600" onClick={() => setNavOpen(false)} prefetch={link.prefetch}>{link.name}</Link>
                        ))}
                        {session?.user.role === "admin" && path.startsWith("/admin") && (
                            <div className="flex flex-col gap-4 mt-8">
                                <h1 className="text-sidebar-primary font-bold">Admin site</h1>
                                {adminLinks.map((link) => (
                                    <Link key={link.url} href={link.url} className="dark:hover:text-gray-300 hover:text-gray-600 flex gap-2" onClick={() => setNavOpen(false)} prefetch={link.prefetch}>{link.name}</Link>
                                ))}
                            </div>
                        )}
                    </div>



                    <div className="flex justify-end items-center gap-4 h-12">
                        {session && <MobileUserNav user={session.user} setNavOpen={(open) => setNavOpen(open)} />}
                        <ThemeToggle className="h-12 w-12" />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

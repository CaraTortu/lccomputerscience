"use client"
import {
    BadgeCheck,
    ChevronDown,
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { type User } from "~/server/auth"
import { authClient } from "~/lib/auth-client"
import { capitalise } from "~/lib/utils"
import { toast } from "sonner"

export function NavUser({
    user,
}: {
    user: User,
}) {
    const router = useRouter()

    const logout = async () => {
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
        return
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="group" asChild>
                <div className="flex gap-2 hover:cursor-pointer items-center">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.image!} alt="Profile picture" />
                        <AvatarFallback className="rounded-full">{user.name?.slice(0, 2) ?? user.email?.slice(0, 2) ?? "UR"}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="group-data-[state=open]:rotate-[-90deg] transition-transform" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.image!} alt="Profile picture" />
                            <AvatarFallback className="rounded-full">{user.name?.slice(0, 2) ?? user.email?.slice(0, 2) ?? "UR"}</AvatarFallback>
                        </Avatar>
                        {user.name ? (
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold capitalize">{user.name} - {capitalise(user.tier)}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                        ) : (
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user.email}</span>
                                <span className="truncate text-xs capitalize">{capitalise(user.tier)}</span>
                            </div>
                        )}
                    </div>
                </DropdownMenuLabel>
                {user.tier === "free" && (
                    <>
                        <DropdownMenuSeparator />
                        < DropdownMenuGroup >
                            <Link href="/pricing" prefetch={false}>
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
                    <Link href="/account">
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

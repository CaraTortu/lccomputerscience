/**
 * Navbar Links
 */

import { BookIcon, type LucideIcon, UserIcon } from "lucide-react";

export type NavbarLinkType = {
    name: string;
    url: string;
    hideIfLoggedIn?: boolean;
    adminOnly?: boolean;
    prefetch?: boolean;
};

export const navbarLinks: NavbarLinkType[] = [
    {
        name: "Home",
        url: "/",
        prefetch: false,
    },
    {
        name: "Content",
        url: "/content",
    },
    {
        name: "Contact us",
        url: "/contact",
        prefetch: false,
        hideIfLoggedIn: true,
    },
    {
        name: "Pricing",
        url: "/pricing",
        prefetch: false,
        hideIfLoggedIn: true,
    },
    {
        name: "Sign In",
        url: "/login",
        prefetch: false,
        hideIfLoggedIn: true,
    },
    {
        name: "Admin",
        url: "/admin/content",
        prefetch: false,
        adminOnly: true,
    },
];

/**
 * Admin links
 */

export const adminLinks: (NavbarLinkType & { icon: LucideIcon })[] = [
    {
        name: "Content",
        url: "/admin/content",
        icon: BookIcon,
    },
    {
        name: "Users",
        url: "/admin/users",
        icon: UserIcon,
    },
];

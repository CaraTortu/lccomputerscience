/**
 * Navbar Links
 */

import { BookIcon, type LucideIcon, UserIcon } from "lucide-react";

export type NavbarLinkType = {
    name: string;
    url: string;
    hideIfLoggedIn?: boolean;
    adminOnly?: boolean;
};

export const navbarLinks: NavbarLinkType[] = [
    {
        name: "Home",
        url: "/",
    },
    {
        name: "Content",
        url: "/content",
    },
    {
        name: "Contact us",
        url: "/contact",
        hideIfLoggedIn: true,
    },
    {
        name: "Pricing",
        url: "/pricing",
        hideIfLoggedIn: true,
    },
    {
        name: "Sign In",
        url: "/login",
        hideIfLoggedIn: true,
    },
    {
        name: "Admin",
        url: "/admin/content",
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

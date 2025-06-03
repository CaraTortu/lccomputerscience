/**
 * Navbar Links
 */

import { BookIcon, type LucideIcon, UserIcon } from "lucide-react";
import { type SubscriptionType } from "./lib/types";

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

/**
 * Stripe plans
 */
export const planFeatures: Record<SubscriptionType, string[]> = {
    free: [
        "Access to core tutorials",
        "Basic practice questions",
        "Progress tracking",
        "Limited access to past exam papers",
    ],
    pro: [
        "All free plan features",
        "Full library of tutorials and exercises",
        "Unlimited access to past exam papers",
        "Priority support",
    ],
};

export const planComparison = [
    { name: "Access to core tutorials", free: true, pro: true },
    { name: "Basic practice questions", free: true, pro: true },
    { name: "Progress tracking", free: true, pro: true },
    { name: "Full access to past exam papers", free: false, pro: true },
    { name: "Full library of tutorials and exercises", free: false, pro: true },
    { name: "Unlimited access to past exam papers", free: false, pro: true },
    { name: "Priority support", free: false, pro: true },
];

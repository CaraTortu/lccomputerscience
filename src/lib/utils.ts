import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toDatetime(epoch: number) {
    const t = new Date(+0);
    t.setSeconds(epoch);
    return t;
}

export function calculateTrialEndUnixTimestamp(
    trialPeriodDays: number | null | undefined,
) {
    // Check if trialPeriodDays is null, undefined, or less than 2 days
    if (
        trialPeriodDays === null ||
        trialPeriodDays === undefined ||
        trialPeriodDays < 2
    ) {
        return undefined;
    }

    const currentDate = new Date(); // Current date and time
    const trialEnd = new Date(
        currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000,
    ); // Add trial days
    return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
}

export function getBaseUrl() {
    if (typeof window !== "undefined") return window.location.origin;
    if (process.env.NEXT_PUBLIC_WEB_URL) return process.env.NEXT_PUBLIC_WEB_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function capitalise(s: string) {
    return s.at(0)!.toUpperCase() + s.slice(1);
}

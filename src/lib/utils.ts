import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Tier } from "~/server/db";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isAllowedTier(userTier: Tier, contentTier: Tier) {
    const tierOrder = ["free", "bronze", "silver", "gold"];

    const userIndex = tierOrder.indexOf(userTier);
    const contentIndex = tierOrder.indexOf(contentTier);

    return userIndex >= contentIndex;
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

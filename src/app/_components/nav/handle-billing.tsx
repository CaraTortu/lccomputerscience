"use client"

import { CreditCard } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function BillingButton() {
    const router = useRouter()
    const getBillingUrl = api.stripe.getBillingPortalUrl.useMutation()

    const handleBilling = async () => {
        const result = await getBillingUrl.mutateAsync({ returnUrl: window.location.href })

        if (!result.success || !result.url) {
            toast.error("Error", {
                description: "Could not redirect you to billing. Please try again later"
            })
            return;
        }

        router.push(result.url)
    }
    return (
        <DropdownMenuItem onClick={() => handleBilling()}>
            <CreditCard />
            Billing
        </DropdownMenuItem>
    )

}

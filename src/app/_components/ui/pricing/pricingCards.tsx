"use client"

import { type StripeTier } from "~/server/db"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card"
import { type Session } from "~/server/auth"
import { Check } from "lucide-react"
import { Button } from "../button"
import Link from "next/link"
import { api } from "~/trpc/react"
import { useToast } from "~/hooks/use-toast"
import { getStripe } from "~/lib/stripe"
import { useRouter } from "next/navigation"

export default function PricingCards({ cards, session }: { session: Session | null, cards: Record<StripeTier, { name: string, price: number, features: string[] }> }) {
    const { toast } = useToast()
    const router = useRouter()
    const checkoutSessionMutation = api.stripe.createCheckoutSession.useMutation()
    const createPortalSessionMutation = api.stripe.createPortalSession.useMutation()

    const handleCheckout = async (tierCode: StripeTier) => {

        // Make sure the user is not already on the selected tier
        if (!session || session.user.tier === tierCode) {
            return
        }

        if (session.user.tier !== "free") {
            const url = await createPortalSessionMutation.mutateAsync({ returnUrl: window.location.href })
            if (!url.success || !url.url) {
                toast({
                    title: "Error",
                    description: url.reason ?? "An error occurred. Please try again later",
                    variant: "destructive",
                    duration: 2000,
                })
                return
            }

            router.push(url.url)
        }

        const result = await checkoutSessionMutation.mutateAsync({ tier: tierCode })

        if (!result.success || !result.sessionId) {
            toast({
                title: "Error",
                description: result.reason ?? "An error occurred. Please try again later",
                variant: "destructive",
                duration: 2000,
            })
            return
        }

        const checkoutId = result.sessionId

        const stripe = await getStripe()
        await stripe?.redirectToCheckout({ sessionId: checkoutId })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {Object.entries(cards).map(([tierCode, tier], _) => (
                <Card key={tierCode} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">{tier.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="grow">
                        <p className="text-4xl font-bold text-center mb-6">
                            {tier.price}€
                            <span className="text-xl font-normal">/yr</span>
                        </p>
                        <ul className="space-y-2">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-green-500" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        {session ? (
                            <Button
                                onClick={() => handleCheckout(tierCode as StripeTier)}
                                disabled={session.user.tier === tierCode}
                                className="w-full">
                                {session.user.tier === tierCode ? "Current Plan" : `Switch to ${tier.name}`}
                            </Button>
                        ) : (
                            <Link href="/login" className="w-full">
                                <Button className="w-full">Choose {tier.name}</Button>
                            </Link>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div >

    )
}

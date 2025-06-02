"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card"
import { Check } from "lucide-react"
import { Button } from "../button"
import Link from "next/link"
import { authClient } from "~/lib/auth-client"
import { type SubscriptionType } from "~/lib/types"
import { capitalise } from "~/lib/utils"
import { type User } from "~/server/auth"

export type PricingCardType = {
    name: SubscriptionType,
    price: number,
    features: string[]
}

export default function PricingCards({ cards, session }: { session: User | null, cards: PricingCardType[] }) {
    const handleCheckout = async (tierCode: string) => {

        // Make sure the user is not already on the selected tier
        if (!session || session?.tier === tierCode) {
            return
        }

        if (session.tier === "free") {
            await authClient.subscription.upgrade({
                plan: tierCode,
                cancelUrl: "/pricing",
                successUrl: "/pricing"
            })
        } else {
            await authClient.subscription.cancel({
                returnUrl: "/pricing"
            })
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {cards.map(card => (
                <Card key={card.name} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">{capitalise(card.name)}</CardTitle>
                    </CardHeader>
                    <CardContent className="grow">
                        <p className="text-4xl font-bold text-center mb-6">
                            {card.price}€
                            <span className="text-xl font-normal">/mo</span>
                        </p>
                        <ul className="space-y-2">
                            {card.features.map((feature) => (
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
                                onClick={() => handleCheckout(card.name)}
                                disabled={session.tier === card.name}
                                className="w-full">
                                {session.tier === card.name ? "Current Plan" : `Switch to ${capitalise(card.name)}`}
                            </Button>
                        ) : (
                            <Link href="/login" className="w-full">
                                <Button className="w-full">Choose {capitalise(card.name)}</Button>
                            </Link>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div >

    )
}

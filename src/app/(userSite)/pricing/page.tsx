import { Check, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/app/_components/ui/table"
import { auth } from "~/server/auth"
import PricingCards, { type PricingCardType } from "~/app/_components/ui/pricing/pricingCards"
import { headers } from "next/headers"
import { db } from "~/server/db"
import { type SubscriptionType } from "~/lib/types"
import { planComparison, planFeatures } from "~/constants"

function PlanComparison() {
    return (
        <div>
            <h2 className="text-3xl font-bold text-center mb-8">Plan Comparison</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/4">Feature</TableHead>
                            <TableHead className="w-1/4 text-center">Free</TableHead>
                            <TableHead className="w-1/4 text-center">Pro</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {planComparison.map((feature) => (
                            <TableRow key={feature.name}>
                                <TableCell className="font-medium">{feature.name}</TableCell>
                                <TableCell className="text-center">{renderValue(feature.free)}</TableCell>
                                <TableCell className="text-center">{renderValue(feature.pro)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function renderValue(value: boolean | string) {
    if (typeof value === "boolean") {
        return value ? (
            <Check className="inline-block h-4 w-4 text-green-500" />
        ) : (
            <X className="inline-block h-4 w-4 text-red-500" />
        )
    }
    return value
}



export default async function PricingPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const tiers: PricingCardType[] = [{
        name: "free",
        price: 0,
        features: planFeatures.free
    }, ...(await db.query.stripePlans.findMany()).map(tier => ({
        name: tier.name as SubscriptionType,
        price: tier.price,
        features: planFeatures[tier.name as SubscriptionType]
    }))]

    return (
        <div className="container mx-auto px-4 py-16 grow max-w-6xl">
            <h1 className="text-4xl font-bold text-center mb-12">Our Pricing Plans</h1>
            <PricingCards cards={tiers} session={session?.user ?? null} />
            <PlanComparison />
        </div>
    )
}


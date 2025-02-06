import { Check, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/app/_components/ui/table"
import { auth } from "~/server/auth"
import { db, type StripeTier, } from "~/server/db"
import PricingCards from "~/app/_components/ui/pricing/pricingCards"
import { eq } from "drizzle-orm"
import { stripePrices, stripeProducts } from "~/server/db/schema"
import { headers } from "next/headers"

const tiers: Record<StripeTier, { name: string, price: number, features: string[] }> = {
    bronze: {
        name: "Bronze",
        price: 30,
        features: ["Support for Project Report", "Guided support for each project requirement", "Easy to follow guides for ALT assignments", "Powerpoints and worksheets", "Python guide for section C"],
    },
    silver: {
        name: "Silver",
        price: 59,
        features: ["Intensive exam revision", "Discount to one to one tuition", "Everything from Bronze"],
    },
    gold: {
        name: "Gold",
        price: 99,
        features: ["Forum for support with any problem", "Personalized project support", "AI generated content", "Everything from Silver"],
    },
}

const features = [
    { name: "Support for Project Report", bronze: true, silver: true, gold: true },
    { name: "Guided support for each project requirement", bronze: true, silver: true, gold: true },
    { name: "Easy to follow guides for ALT assignments", bronze: true, silver: true, gold: true },
    { name: "Powerpoints and worksheets", bronze: true, silver: true, gold: true },
    { name: "Python guide for section C", bronze: true, silver: true, gold: true },
    { name: "Intensive exam revision", bronze: false, silver: true, gold: true },
    { name: "Discount to one to one tuition", bronze: false, silver: true, gold: true },
    { name: "Forum for support with any problem", bronze: false, silver: false, gold: true },
    { name: "Personalized project support", bronze: false, silver: false, gold: true },
    { name: "AI generated content", bronze: false, silver: false, gold: true },
]

function PlanComparison() {
    return (
        <div>
            <h2 className="text-3xl font-bold text-center mb-8">Plan Comparison</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/4">Feature</TableHead>
                            <TableHead className="w-1/4 text-center">Bronze</TableHead>
                            <TableHead className="w-1/4 text-center">Silver</TableHead>
                            <TableHead className="w-1/4 text-center">Gold</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {features.map((feature) => (
                            <TableRow key={feature.name}>
                                <TableCell className="font-medium">{feature.name}</TableCell>
                                <TableCell className="text-center">{renderValue(feature.bronze)}</TableCell>
                                <TableCell className="text-center">{renderValue(feature.silver)}</TableCell>
                                <TableCell className="text-center">{renderValue(feature.gold)}</TableCell>
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

    // Get latest prices. If a price is not defined, we will use a default value
    const dbTiers = await db.query.stripeProducts.findMany({
        where: eq(stripeProducts.active, true),
        with: {
            prices: {
                where: eq(stripePrices.active, true),
            }
        }
    })

    for (const tier of dbTiers) {

        // Make sure the user has defined a price
        if (tier.prices.length === 0 || !tier.prices[0]!.unitAmount) {
            continue
        }

        const price = tier.prices[0]!

        // Ensure the price has a unit amount
        if (!price.unitAmount) {
            continue
        }

        switch (tier.tier) {
            case "bronze":
                tiers.bronze.price = price.unitAmount / 100
                break
            case "silver":
                tiers.silver.price = price.unitAmount / 100
                break
            case "gold":
                tiers.gold.price = price.unitAmount / 100
                break
        }
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-12">Our Pricing Plans</h1>
            <PricingCards cards={tiers} session={session} />
            <PlanComparison />
        </div>
    )
}


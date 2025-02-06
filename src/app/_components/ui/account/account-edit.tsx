"use client"

import { type User } from "~/server/auth"
import { CardContent } from "../card"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField } from "../form"
import { Label } from "../label"
import { Input } from "../input"
import { Button } from "../button"
import { useToast } from "~/hooks/use-toast"
import { authClient } from "~/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { KeyIcon, UserPenIcon } from "lucide-react"

const editAccountSchema = z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email(),
    image: z.string().url().optional()
})

type AccountSchema = z.infer<typeof editAccountSchema>


type AccountEditProps = {
    user: User
}

export default function AccountEdit({ user }: AccountEditProps) {
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(editAccountSchema),
        defaultValues: {
            name: user.name,
            image: user.image ?? "",
            email: user.email
        },
    })

    const onSubmit = async (data: AccountSchema) => {
        // Change email if it's different
        if (data.email !== user.email) {
            const result = await authClient.changeEmail({
                newEmail: data.email
            })

            if (result.error) {
                toast({
                    title: "Error",
                    description: result.error.message ?? "An error occurred. Please try again later.",
                    variant: "destructive",
                    duration: 2000,
                })
                return
            }

            toast({
                title: "Success",
                description: "Email updated successfully",
                duration: 2000,
            })

            router.refresh()
        }

        // Don't submit if the data is the same
        if (data.image === user.image && data.name === user.name) {
            return
        }

        const result = await authClient.updateUser({
            name: data.name,
            image: data.image,
        })

        if (result.error) {
            toast({
                title: "Error",
                description: result.error.message ?? "An error occurred. Please try again later.",
                variant: "destructive",
                duration: 2000,
            })
            return
        }

        toast({
            title: "Success",
            description: "Account updated successfully",
            duration: 2000,
        })

        router.refresh()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
                <CardContent className="grid gap-4">
                    <h1 className="font-bold text-xl py-2">Account information</h1>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    disabled
                                    {...field}
                                />
                                <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                            </div>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor={field.name}>Name</Label>
                                <Input {...field} />
                                <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                            </div>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor={field.name}>Image</Label>
                                <Input {...field} />
                                <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                            </div>
                        )}
                    />

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" className="flex gap-2">
                            <UserPenIcon />
                            Update account
                        </Button>
                        <Link href="/passwordreset">
                            <Button variant="secondary">
                                <KeyIcon />
                                Change password
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </form>
        </Form >
    )
}


"use client"

import { z } from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField } from "../ui/form"
import { useToast } from "~/hooks/use-toast"
import { useRouter } from "next/navigation"
import { authClient } from "~/lib/auth-client"

const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
})

type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>

export default function ForgotPasswordForm() {
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<ResetPasswordFormType>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const resetPassword = async (data: ResetPasswordFormType) => {
        const result = await authClient.forgetPassword({
            email: data.email,
            redirectTo: "/passwordreset"
        })


        if (result.error) {
            toast({
                title: "Error",
                description: result.error.message ?? "An error occurred. Please try again later",
                variant: "destructive",
                duration: 2000,
            })
            return
        }

        toast({
            title: "An email has been sent to reset your password",
            duration: 2000,
        })

        router.push("/login")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(resetPassword)} className="grid gap-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                {...field}
                                type="email"
                                placeholder="m@example.com"
                                className={fieldState.error && "border-red-500"}
                            />
                            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                        </div>
                    )}
                />
                <Button type="submit" className="w-full" >
                    Send reset email
                </Button>
            </form>
        </Form>
    )
}

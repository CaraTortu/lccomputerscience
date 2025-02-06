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
import { passwordVerificationSchema } from "~/lib/schemas"
import { authClient } from "~/lib/auth-client"

const resetPasswordSchema = z.object({
    newPassword: passwordVerificationSchema,
    oldPassword: z
        .string()
        .min(1, "Password is required"),
})

type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordForm() {
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<ResetPasswordFormType>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            oldPassword: "",
        },
    })

    const resetPassword = async (data: ResetPasswordFormType) => {
        const result = await authClient.changePassword({
            newPassword: data.newPassword,
            currentPassword: data.oldPassword,
            revokeOtherSessions: true,
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
            title: "Password reset successful",
            duration: 2000,
        })

        router.push("/content")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(resetPassword)} className="grid gap-6">
                <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="email">Current Password</Label>
                            <Input
                                {...field}
                                type="password"
                                className={fieldState.error && "border-red-500"}
                                placeholder="*******"
                                autoFocus
                            />
                            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                {...field}
                                type="password"
                                placeholder="*******"
                                className={fieldState.error && "border-red-500"}
                            />
                            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                        </div>
                    )}
                />
                <Button type="submit" className="w-full">
                    Reset password
                </Button>
            </form>
        </Form>
    )
}

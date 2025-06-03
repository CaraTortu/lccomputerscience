"use client"

import { z } from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField } from "../ui/form"
import { useRouter } from "next/navigation"
import { passwordVerificationSchema } from "~/lib/schemas"
import { api } from "~/trpc/react"
import { toast } from "sonner"

const setPasswordSchema = z.object({
    password: passwordVerificationSchema,
})

type ResetPasswordFormType = z.infer<typeof setPasswordSchema>

export default function SetPasswordForm() {
    const router = useRouter()
    const setPasswordMutation = api.user.setPassword.useMutation()

    const form = useForm<ResetPasswordFormType>({
        resolver: zodResolver(setPasswordSchema),
        defaultValues: {
            password: "",
        },
    })

    const resetPassword = async (data: ResetPasswordFormType) => {
        const result = await setPasswordMutation.mutateAsync({
            password: data.password,
        })

        if (!result.status) {
            toast.error("Error", {
                description: "An error occurred. Please try again later",
                duration: 2000,
            })
            return
        }

        toast.success("Password set successfully", {
            duration: 2000,
        })

        router.push("/content")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(resetPassword)} className="grid gap-6">
                <FormField
                    control={form.control}
                    name="password"
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
                    Set password
                </Button>
            </form>
        </Form>
    )
}

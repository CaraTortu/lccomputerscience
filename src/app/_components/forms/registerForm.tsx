"use client"

import { type z } from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField } from "../ui/form"
import { useRouter } from "next/navigation"
import { registrationSchema } from "~/lib/schemas"
import { authClient } from "~/lib/auth-client"
import { toast } from "sonner"

type RegistrationFormType = z.infer<typeof registrationSchema>

export default function RegisterForm() {
    const router = useRouter()

    const form = useForm<RegistrationFormType>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
        },
    })

    const login = async (data: RegistrationFormType) => {
        const result = await authClient.signUp.email({
            email: data.email,
            name: data.name,
            password: data.password
        })

        if (result.error) {
            toast.error("Error", {
                description: result.error.message ?? "Something went wrong, please try again later",
                duration: 2000,
            })
            return
        }

        toast.success("Account created successfully! Please check your email to verify your account", {
            duration: 2000,
        })

        router.push("/login")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(login)} className="grid gap-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                {...field}
                                type="email"
                                className={fieldState.error && "border-red-500"}
                                placeholder="m@example.com"
                                autoFocus
                            />
                            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="email">Name</Label>
                            <Input
                                {...field}
                                className={fieldState.error && "border-red-500"}
                                placeholder="John Doe"
                                autoFocus
                            />
                            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                {...field}
                                type="password"
                                className={fieldState.error && "border-red-500"}
                            />
                            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                        </div>
                    )}
                />
                <Button type="submit" className="w-full">
                    Create account
                </Button>
            </form>
        </Form>
    )
}

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
import { Checkbox } from "../ui/checkbox"

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean(),
})

type LoginFormType = z.infer<typeof loginSchema>

export default function LoginForm() {
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<LoginFormType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: true
        },
    })

    const login = async (data: LoginFormType) => {
        await authClient.signIn.email({
            email: data.email,
            password: data.password,
            rememberMe: data.rememberMe,
        }, {
            onError: (ctx) => {
                let message = "Invalid email or password"

                if (ctx.error.status === 403) {
                    message = "Please verify your email address"
                }

                toast({
                    title: "Error",
                    description: message,
                    variant: "destructive",
                    duration: 2000,
                })
            },
            onSuccess: () => {
                toast({
                    title: "Login successful",
                    duration: 2000,
                })

                router.push("/content")
                router.refresh()
            }
        })
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
                    name="password"
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="/passwordreset"
                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input
                                {...field}
                                type="password"
                                className={fieldState.error && "border-red-500"}
                            />
                            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                        <div className="flex gap-2 items-center">
                            <Checkbox
                                id="remember"
                                className="size-5"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label
                                    htmlFor="remember"
                                    className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Remember me
                                </Label>
                            </div>
                        </div>
                    )}
                />
                <Button type="submit" className="w-full">
                    Login
                </Button>
            </form>
        </Form>
    )
}

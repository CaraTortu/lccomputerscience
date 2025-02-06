"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { PulseLoader } from "react-spinners"
import { type z } from "zod"
import { Button } from "~/app/_components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/app/_components/ui/card"
import { Form, FormField } from "~/app/_components/ui/form"
import { Input } from "~/app/_components/ui/input"
import { Label } from "~/app/_components/ui/label"
import { Textarea } from "~/app/_components/ui/textarea"
import { useToast } from "~/hooks/use-toast"
import { authClient } from "~/lib/auth-client"
import { contactSchema } from "~/lib/schemas"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"



type ContactFormType = z.infer<typeof contactSchema>

export default function ContactUs() {
    const session = authClient.useSession()
    const contactMutation = api.contact.contact.useMutation()
    const { toast } = useToast()
    const form = useForm<ContactFormType>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    })

    useEffect(() => {
        if (session.data) {
            form.setValue("name", session.data.user.name)
            form.setValue("email", session.data.user.email)
        }
    }, [session, form])

    const sendEmail = async (data: ContactFormType) => {
        const result = await contactMutation.mutateAsync(data)

        if (!result.success) {
            toast({
                title: "Error",
                description: "An error occurred. Please try again later",
                variant: "destructive",
                duration: 2000,
            })
            return
        }

        toast({
            title: "Email sent successfully!",
            duration: 2000,
        })
        form.reset()
        return;
    }

    return (
        <div className="flex-grow flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-screen-md flex-col gap-6">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Contact us</CardTitle>
                        <div className="flex justify-center">
                            <Image src="/assets/png/char.png" alt="Contact us" width={150} height={150} />
                        </div>
                        <CardDescription>
                            We are here to help you with any questions you may have!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(sendEmail)} className="flex flex-col gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field, fieldState }) => (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                {...field}
                                                className={fieldState.error && "border-red-500"}
                                                type="text"
                                                placeholder="John Doe"
                                            />
                                            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field, fieldState }) => (
                                        <div className="flex flex-col gap-2">
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
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field, fieldState }) => (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="message">Message</Label>
                                            <div className="relative">
                                                <Textarea
                                                    {...field}
                                                    placeholder="Your message here"
                                                    className={cn("min-h-32", fieldState.error && "border-red-500")}
                                                    maxLength={500}
                                                />
                                                <div className="absolute bottom-2 right-4">
                                                    <span className="text-sm text-gray-500">{field.value.length}/500 characters</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                                        </div>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={contactMutation.status === "pending"}>
                                    {contactMutation.status === "pending" ? <PulseLoader color="hsl(var(--primary-foreground))" size="0.5rem" /> : "Send email"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}

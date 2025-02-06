"use client"
import { type DBUser } from "~/server/db";
import { Separator } from "../../separator";
import { Button } from "../../button";
import { SaveIcon } from "lucide-react";
import { type z } from "zod";
import { updateUserSchema } from "~/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../../form";
import { Label } from "../../label";
import { Input } from "../../input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../select";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export function UserEdit({ user }: { user: DBUser }) {
    const [changed, setChanged] = useState(false);
    const userEditMutation = api.admin.updateUser.useMutation();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image ?? "",
            tier: user.tier,
            role: user.role as "user" | "admin",
        },
    });

    // Watch for changes in the form
    form.watch(() => {
        setChanged(true);
    });

    const onSubmit = async (data: UpdateUserSchema) => {
        const result = await userEditMutation.mutateAsync(data);

        if (result.success) {
            setChanged(false);
            router.refresh()
            toast({
                title: "User updated!",
                description: "User has been updated successfully",
                duration: 2000,
            });
        } else {
            toast({
                title: "Error",
                description: "An error occurred while updating the user",
                duration: 2000,
                variant: "destructive",
            });
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <Avatar className="size-[50px] rounded-lg">
                                    <AvatarImage src={user.image ?? ""} alt="Profile picture" />
                                    <AvatarFallback className="rounded-full">{user.name?.slice(0, 2) ?? user.email?.slice(0, 2) ?? "UR"}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-bold">{user.name}</h1>
                                    <p className="text-primary-foreground/80 font-light">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button disabled={!changed} type="submit" className="flex gap-2"><SaveIcon />Update user</Button>
                                {/*{user.banned ? <Button className="flex gap-2" variant="outline"><ShieldOffIcon /> Unban</Button> : <Button variant="outline" className="flex gap-2"> <GavelIcon /> Ban</Button>}
                                <Button className="flex gap-2" variant="destructive"><Trash2Icon /> Delete</Button>*/}
                            </div>
                        </div>
                        <div className="px-16 pb-8">
                            <li><span className="font-bold">Member since:</span> {user.createdAt.toUTCString()}</li>
                            <li><span className="font-bold">Last login:</span> {user.lastLoginAt ? user.lastLoginAt.toUTCString() : "User has never logged in"}</li>
                            <li><span className="font-bold">Email verified:</span> {user.emailVerified ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span>}</li>
                            <li><span className="font-bold">Tier:</span> {user.tier}</li>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-3 pt-8">
                        <div className="flex">
                            <div className="flex flex-col gap-4 w-full max-w-md py-8">
                                <h1 className="text-xl font-semibold pb-4">Profile</h1>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field, fieldState }) => (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input {...field} id="name" placeholder="John doe" />
                                            <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                        </div>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field, fieldState }) => (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input {...field} id="email" placeholder="johndoe@example.com" />
                                            <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                        </div>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field, fieldState }) => (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="image">Profile picture</Label>
                                            <Input {...field} id="image" placeholder="https://example.com" />
                                            <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="flex flex-grow justify-center">
                                <Separator orientation="vertical" />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex flex-col w-full max-w-md py-8 gap-4">
                                <h1 className="text-xl font-semibold pb-4">Account controls</h1>
                                <FormField
                                    control={form.control}
                                    name="emailVerified"
                                    render={({ field }) => (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="emailVerified">Email Verified</Label>
                                            <Select
                                                value={`${field.value ? "Yes" : "No"}`}
                                                onValueChange={(value) => {
                                                    field.onChange(value === "Yes")
                                                }}
                                            >
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder={user.emailVerified ? "Yes" : "No"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={`Yes`}>
                                                        Yes
                                                    </SelectItem>
                                                    <SelectItem value={`No`}>
                                                        No
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tier"
                                    render={({ field }) => (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="tier">Tier</Label>
                                            <Select
                                                value={`${field.value}`}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder={user.tier} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {["free", "bronze", "silver", "gold"].map((tier) => (
                                                        <SelectItem key={tier} value={tier}>
                                                            {tier.charAt(0).toUpperCase() + tier.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="flex flex-grow justify-center">
                                <Separator orientation="vertical" />
                            </div>
                        </div>
                        <div className="flex flex-col w-full max-w-md py-8 gap-4">
                            <h1 className="text-xl font-semibold pb-4">Administration</h1>
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            value={`${field.value}`}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder={user.role} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["user", "admin"].map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <div className="pt-10">
                    </div>
                </form>
            </Form>
        </div>
    )
}

"use client"
import { type DBUser } from "~/server/db";
import { Separator } from "../../separator";
import { Button } from "../../button";
import { CalendarIcon, GavelIcon, SaveIcon, ShieldOffIcon, Trash2Icon } from "lucide-react";
import { z } from "zod";
import { updateUserSchema } from "~/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../../form";
import { Label } from "../../label";
import { Input } from "../../input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../select";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../../dialog";
import { authClient } from "~/lib/auth-client";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { cn } from "~/lib/utils";
import { format } from "date-fns"
import { Calendar } from "../../calendar";
import { toast } from "sonner";

type UpdateUserSchema = z.infer<typeof updateUserSchema>;

function DeleteUser({ user }: { user: DBUser }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const deleteUser = async () => {
        const result = await authClient.admin.removeUser({ userId: user.id });

        if (result.error) {
            toast.error("Error", {
                description: result.error.message ?? "An error occurred while deleting the user",
                duration: 2000,
            });

            return
        }

        toast.success("User deleted", {
            description: "User has been deleted",
            duration: 2000,
        });
        router.push("/admin/users")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex gap-2" variant="destructive"><Trash2Icon /> Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete user</DialogTitle>
                <DialogDescription>Are you sure you want to delete this user? This action is irreversible.</DialogDescription>
                <div className="flex gap-4 pt-4">
                    <Button onClick={() => deleteUser()} variant="destructive">Delete</Button>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const banUserSchema = z.object({
    userId: z.string(),
    banReason: z.string().optional(),
    banExpiresIn: z.date(),
})

type BanUserSchema = z.infer<typeof banUserSchema>;

function BanUser({ user }: { user: DBUser }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const form = useForm<BanUserSchema>({
        resolver: zodResolver(banUserSchema),
        defaultValues: {
            userId: user.id,
            banReason: "",
            banExpiresIn: tomorrow,
        },
    })

    const banUser = async (data: BanUserSchema) => {
        const result = await authClient.admin.banUser({
            userId: data.userId,
            banReason: data.banReason,
            banExpiresIn: data.banExpiresIn.getTime() / 1000 - new Date().getTime() / 1000,
        });

        if (result.error) {
            toast.error("Error", {
                description: result.error.message ?? "An error occurred while banning the user",
                duration: 2000,
            });

            return
        }

        toast.success("User banned", {
            description: "User has been banned",
            duration: 2000,
        });
        router.refresh()
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex gap-2" variant="secondary"><GavelIcon /> Ban</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Ban user</DialogTitle>
                <DialogDescription></DialogDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(banUser)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="banReason"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="banReason">Reason</Label>
                                    <Input {...field} id="banReason" placeholder="Reason for ban" />
                                    <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="banExpiresIn"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="banExpiresIn">Expires at</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[280px] justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <div className="flex gap-4 pt-4">
                            <Button variant="destructive" className="flex gap-2"><GavelIcon /> Ban</Button>
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export function UserEdit({ user }: { user: DBUser }) {
    const [changed, setChanged] = useState(false);
    const userEditMutation = api.admin.updateUser.useMutation();
    const router = useRouter();

    const form = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image ?? null,
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
            toast.success("User updated!", {
                description: "User has been updated successfully",
                duration: 2000,
            });
        } else {
            toast.error("Error", {
                description: "An error occurred while updating the user",
                duration: 2000,
            });
        }
    }

    const unbanUser = async () => {
        const result = await authClient.admin.unbanUser({ userId: user.id });

        if (result.error) {
            toast.error("Error", {
                description: result.error.message ?? "An error occurred while unbanning the user",
                duration: 2000,
            });

            return
        }

        toast.error("User unbanned", {
            description: "User has been unbanned",
            duration: 2000,
        });
        router.refresh()
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
                                {user.banned ? <Button className="flex gap-2" variant="outline" onClick={() => unbanUser()}><ShieldOffIcon /> Unban</Button> : <BanUser user={user} />}
                                <DeleteUser user={user} />
                            </div>
                        </div>
                        <div className="px-16 pb-8">
                            <li><span className="font-bold">Member since:</span> {user.createdAt.toUTCString()}</li>
                            <li><span className="font-bold">Last login:</span> {user.lastLoginAt ? user.lastLoginAt.toUTCString() : "User has never logged in"}</li>
                            <li><span className="font-bold">Email verified:</span> {user.emailVerified ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span>}</li>
                            <li><span className="font-bold">Tier:</span> {user.tier}</li>
                            <li><span className="font-bold">Banned:</span> {user.banned ? <span className="text-green-400">Yes, until {user.banExpires?.toDateString()} because &quot;{user.banReason}&quot;</span> : <span className="text-red-400">No</span>}</li>
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
                                            <Input value={field.value ?? ""} onChange={field.onChange} id="image" placeholder="https://example.com" />
                                            <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="flex grow justify-center">
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
                            <div className="flex grow justify-center">
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
                </form>
            </Form>
        </div>
    )
}

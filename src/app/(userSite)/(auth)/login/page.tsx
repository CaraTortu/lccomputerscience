import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "~/app/_components/forms/loginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/app/_components/ui/card";
import GoogleSignin from "~/app/_components/ui/login/google-button";
import { auth } from "~/server/auth";

export default async function Login() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        redirect("/content")
    }

    return (
        <div className="flex-grow flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">Welcome back</CardTitle>
                            <CardDescription>
                                Login with your Google account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <GoogleSignin />
                                </div>
                                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                                <LoginForm />
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/register" className="underline underline-offset-4">
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                        By clicking continue, you agree to our <Link href="/terms">Terms of Service</Link>{" "}
                        and <Link href="/terms">Privacy Policy</Link>.
                    </div>
                </div>
            </div>
        </div >
    )
}

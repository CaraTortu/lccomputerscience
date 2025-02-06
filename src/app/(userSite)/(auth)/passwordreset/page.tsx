import { headers } from "next/headers";
import ForgotPasswordForm from "~/app/_components/forms/forgotPasswordForm";
import ResetPasswordForm from "~/app/_components/forms/resetPasswordForm";
import ResetPasswordFormWithToken from "~/app/_components/forms/resetPasswordFormWithToken";
import SetPasswordForm from "~/app/_components/forms/setPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { auth } from "~/server/auth";


export default async function PasswordReset({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    const token = (await searchParams).token as string | undefined

    let userHasPassword: boolean | undefined = undefined

    if (session) {
        const userAccounts = await auth.api.listUserAccounts({
            headers: await headers()
        })

        userHasPassword = userAccounts.some(account => account.provider === "credential")
    }

    return (
        <div className="flex-grow flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <Card>
                        {token || session ? (
                            <CardHeader className="text-center">
                                <CardTitle className="text-xl">Reset password</CardTitle>
                                <CardDescription>
                                    Enter your password to reset it
                                </CardDescription>
                            </CardHeader>
                        ) : (
                            <CardHeader className="text-center">
                                <CardTitle className="text-xl">Forgot password</CardTitle>
                                <CardDescription>
                                    Enter your email to reset your password
                                </CardDescription>
                            </CardHeader>
                        )}
                        <CardContent>
                            {session && !userHasPassword && <SetPasswordForm />}
                            {session && userHasPassword && <ResetPasswordForm />}
                            {!session && token && <ResetPasswordFormWithToken token={token} />}
                            {!session && !token && <ForgotPasswordForm />}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}

import { Button, Container, Text } from "@react-email/components";
import { BaseEmail } from "./base-email";

type PasswordResetEmailProps = {
    user: {
        name: string;
        email: string;
    };
    resetLink: string;
};

export default function PasswordResetEmail({ user, resetLink }: PasswordResetEmailProps) {
    return (
        <BaseEmail>
            <Text className="text-xl">Hi {user.name},</Text>
            <Text className="mt-4">We received a request to reset your password for your account <span className="font-bold">{user.email}</span>.</Text>
            <Text className="mt-4">If you created this request, click the button below to reset your password.</Text>
            <Container className="py-4">
                <Button href={resetLink} className="bg-blue-500 text-white px-6 py-3 rounded-lg">Reset Password</Button>
            </Container>
            <Text className="mt-8">If you did not request to reset your password, you can safely ignore this email and your password will remain the same.</Text>
            <Text className="mt-8">Thanks, <br /><span className="font-bold">The LCComputerScience team</span></Text>
        </BaseEmail>
    )
}

// Props for previewing the email in the browser
PasswordResetEmail.PreviewProps = {
    user: {
        name: 'John Doe',
        email: 'johndoe@example.com'
    },
    resetLink: 'https://example.com/reset-password/123456'
} satisfies PasswordResetEmailProps


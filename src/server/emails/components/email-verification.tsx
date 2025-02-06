import { Button, Container, Link, Text } from "@react-email/components";
import { BaseEmail } from "./base-email";

type EmailVerificationEmailProps = {
    user: {
        name: string;
        email: string;
    };
    verifyLink: string;
    contactEmail: string;
};

export default function EmailVerificationEmail({ user, verifyLink, contactEmail }: EmailVerificationEmailProps) {
    return (
        <BaseEmail>
            <Text className="text-xl">Hi {user.name},</Text>
            <Text className="mt-4">Thanks for creating an account with us! Please click the button below to verify your account.</Text>
            <Container className="py-4">
                <Button href={verifyLink} className="bg-blue-500 text-white px-6 py-3 rounded-lg">Verify account</Button>
            </Container>
            <Text className="mt-8">If you did not create this account, please email us at <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link>.</Text>
            <Text className="mt-8">Thanks, <br /><span className="font-bold">The LCComputerScience team</span></Text>
        </BaseEmail>
    )
}

// Props for previewing the email in the browser
EmailVerificationEmail.PreviewProps = {
    user: {
        name: 'John Doe',
        email: 'johndoe@example.com'
    },
    verifyLink: 'https://example.com/reset-password/123456',
    contactEmail: 'admin@example.com',
} satisfies EmailVerificationEmailProps


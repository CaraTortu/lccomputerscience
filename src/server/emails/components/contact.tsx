import { Button, Text } from "@react-email/components";
import { BaseEmail } from "./base-email";

type ContactEmailProps = {
    user: {
        name: string;
        email: string;
    };
    message: string;
};

export default function ContactEmail({ user, message }: ContactEmailProps) {
    return (
        <BaseEmail>
            <Text className="text-xl">Hi admin,</Text>
            <Text className="mt-2">Someone is contacting you!</Text>
            <ul className="py-4 flex flex-col gap-2">
                <li><span className="font-bold">Name:</span> {user.name}</li>
                <li><span className="font-bold">Email:</span> {user.email}</li>
                <li><span className="font-bold">Message:</span> {message}</li>
            </ul>

            <Button href={`mailto:${user.email}?subject=Re: LCComputerScience query`} className="bg-blue-500 text-white px-6 py-3 rounded-lg">Reply</Button>
        </BaseEmail>
    )
}

// Props for previewing the email in the browser
ContactEmail.PreviewProps = {
    user: {
        name: 'John Doe',
        email: 'johndoe@example.com'
    },
    message: "Hello, I would like to contact you about your services.",
} satisfies ContactEmailProps


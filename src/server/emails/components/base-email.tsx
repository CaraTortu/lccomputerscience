import { type ReactNode } from "react";
import { Container, Head, Html, Tailwind } from "@react-email/components";

export function BaseEmail({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <Html>
            <Head />
            <Tailwind>
                <Container className="p-4">
                    <Container className="px-8 py-4 border border-solid rounded-lg border-gray-500">
                        {children}
                    </Container>
                </Container>
            </Tailwind>
        </Html>
    )
} 

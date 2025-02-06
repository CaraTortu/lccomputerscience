import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "./_components/ui/toaster";
import { ThemeProvider } from "./_components/theme/theme-provider";

export const metadata: Metadata = {
    title: "LC Computer Science",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="font-lexend" suppressHydrationWarning>
            <body>
                <TRPCReactProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </TRPCReactProvider>
            </body>
        </html>
    );
}

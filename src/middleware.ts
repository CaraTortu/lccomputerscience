import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function authMiddleware(request: NextRequest) {
    const path = new URL(request.url).pathname;

    // If path is just /content, continue
    if (path === "/content") return NextResponse.next();

    const session = getSessionCookie(request, {
        cookieName: "session_token",
        cookiePrefix: "better-auth",
        useSecureCookies: true,
    });

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/content/:path*", "/account", "/admin/:path*"],
};

import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "~/server/auth";
import { NextResponse, type NextRequest } from "next/server";

type Session = typeof auth.$Infer.Session;

export default async function authMiddleware(request: NextRequest) {
    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                //get the cookie from the request
                cookie: request.headers.get("cookie") ?? "",
            },
        },
    );

    const path = new URL(request.url).pathname;

    // If path is just /content, continue
    if (path === "/content") return NextResponse.next();

    // If path is admin, but the user is not an admin, return false
    if (
        !session ||
        (path.startsWith("/admin") && session.user.role !== "admin")
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/content/:path*", "/account", "/admin/:path*"],
};

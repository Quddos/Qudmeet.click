import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/forum(.*)',
    '/tools(.*)',
    '/login(.*)',
    '/opportunities(.*)',
]);

const isAdminRoute = createRouteMatcher([
    '/admin(.*)' 
]);


export default clerkMiddleware((auth, req) => {
    const path = req.nextUrl.pathname;

    // Allow sitemap and robots.txt access
    if (path === '/sitemap.xml' || path === '/robots.txt') {
        return;
    }

    // Handle admin routes
    if (isAdminRoute(req)) {
        if (path === '/admin/login') {
            return;
        }

        const adminUsername = req.cookies.get('admin_username')?.value;
        const adminPassword = req.cookies.get('admin_password')?.value;

        if (adminUsername !== 'qudmeet_admin' || adminPassword !== 'Qudmeetadmin123') {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        return;
    }

    // Handle other protected routes
    if (isProtectedRoute(req)) {
        auth().protect();
    }
});


export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

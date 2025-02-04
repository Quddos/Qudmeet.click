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

    // Handle admin routes with manual authentication
    if (isAdminRoute(req)) {
        // Always allow access to admin login page
        if (path === '/admin/login') {
            return;
        }

        // Check admin credentials from cookies
        const adminUsername = req.cookies.get('admin_username')?.value;
        const adminPassword = req.cookies.get('admin_password')?.value;

        // If not authenticated as admin, redirect to admin login
        if (adminUsername !== 'qudmeet_admin' || adminPassword !== 'Qudmeetadmin123') {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        // Allow access to admin routes if credentials are valid
        return;
    }

    // Handle all other protected routes with Clerk (unchanged)
    if (isProtectedRoute(req)) {
        auth().protect();
    }
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
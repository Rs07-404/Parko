import { NextRequest, NextResponse } from 'next/server';
import { ProtectedRoutes } from './lib/routes';
import { PublicRoutes } from './lib/routes';
import { AuthRoutes } from './lib/routes';

export const middleware = (req: NextRequest) => {
    const session = req.cookies.get('accessToken')?.value; // Assuming session is stored in cookies
    const requestedUrl = req.nextUrl.pathname;

    if (!session) {
        NextResponse.redirect(new URL('/login', req.nextUrl.origin)); // Redirect to login if no session
        return; // Stop further processing
    }

    if (ProtectedRoutes.includes(requestedUrl)) {
        if (session) {
            return; // Session exists, allow access to protected route
        } else {
            console.log(`No session, redirecting to login from protected route: ${requestedUrl}`);
            return NextResponse.redirect(new URL('/login', req.nextUrl.origin)); // Absolute URL for redirect
        }
    } else if (PublicRoutes.includes(requestedUrl)) {
        console.log(`Accessing public route: ${requestedUrl}`);
        return; // Public routes are always accessible
    } else if (AuthRoutes.includes(requestedUrl)) {
        if (session) {
            console.log(`Session exists, redirecting to home from auth route: ${requestedUrl}`);
            return NextResponse.redirect(new URL('/home', req.nextUrl.origin)); // Absolute URL for redirect
        } else {
            console.log(`No session, staying on auth route: ${requestedUrl}`);
            return; // No session, redirect to login page
        }
    }
};
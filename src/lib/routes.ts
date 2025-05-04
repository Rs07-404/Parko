export const PublicRoutes = ["/"];
export const AuthRoutes = ["/login","/signup", "/forgot-password", "/reset-password"];
export const ProtectedRoutes = [
    "/settings",
    "/home",
    "/profile",
    "/operator-management",
    "/reservations",
    "/verify-reservation"
];

export const protectedAuthRoutes = ["/verify-email"]
export const TestRoutes = ["/test"];
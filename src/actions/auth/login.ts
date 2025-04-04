import { LoginFormData } from "@/interfaces/zod/schema/auth";

// Function to handle login request
export async function login(data: LoginFormData) {
    // Make the login request
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "allow-credentials": "true",
            "credentials": "include",
        },
        body: JSON.stringify({
            email: data.email,
            password: data.password,
        }),
    });
    // Return the response data
    return response;
}
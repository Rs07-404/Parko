import { SignupFormData } from "@/interfaces/zod/schema/auth";

// Function to handle sign request
export async function signup(data: SignupFormData){
    // Validate the input data against the schema
        // Make the signup request
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "allow-credentials": "true",
                "credentials": "include",
            },
            body: JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                mobile: data.mobile,
                password: data.password,
            }),
        });

        return response;
}
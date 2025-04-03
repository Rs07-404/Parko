import { LoginFormData } from "@/interfaces/zod/schema/auth";
import { toast } from "sonner";

// Function to handle login request
export async function signup(data: LoginFormData){
    // Validate the input data against the schema
    try {
        // Make the signup request
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        });

        const responseData = await response.json();
        // Check if the response is okay
        if (!response.ok) {
            throw new Error(responseData.message);
        }

        toast.success("Signup Successful");
        // Return the response data
        return responseData;
    } catch (error) {
        // Handle errors (e.g., network issues or invalid credentials)
        if (error instanceof Error) {
            toast.error(error?.message ?? "Signup failed");
        }else{
            toast.error("Unexpected Error Occured");
        }
    }
}
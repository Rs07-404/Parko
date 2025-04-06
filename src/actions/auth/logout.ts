
// Function to handle login request
export async function logout() {
    // Make the login request
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "allow-credentials": "true",
            "credentials": "include",
        },
    });
    // Return the response data
    return response;
}
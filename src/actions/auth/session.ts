const getSession = async () => {
    const response = await fetch("/api/auth/session", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            credentials: "include"
        }
    });
    return response;
}

export default getSession;
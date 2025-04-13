const fetchCurrentReservation = async (currentTime: string) => {
    const response = await fetch("/api/reservation/getcurrent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            credentials: "include",
            body: JSON.stringify({currentTime: currentTime})
        }
    });
    return response;
}

export default fetchCurrentReservation;
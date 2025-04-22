const createOperator = async (payload: any) => {
    const response = await fetch("/api/user/operators/create", {
        method: "POST",
        body: JSON.stringify({...payload}),
    })
    return response;
}

export default createOperator;

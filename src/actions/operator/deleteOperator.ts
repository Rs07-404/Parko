const deleteOperator = async (operatorId: string) => {
    const response = await fetch("/api/user/operators/delete", {
        method: "DELETE",
        body: JSON.stringify({operatorId}),
    })
    return response;
}

export default deleteOperator;

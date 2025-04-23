import { CreateOperatorFormValues } from "@/components/Admin/CreateOperatorModal";

const createOperator = async (payload: CreateOperatorFormValues) => {
    const response = await fetch("/api/user/operators/create", {
        method: "POST",
        body: JSON.stringify({...payload}),
    })
    return response;
}

export default createOperator;

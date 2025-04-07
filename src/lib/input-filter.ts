export function filterInputValue(
    type: string | undefined,
    value: string,
    noSpace: boolean
): string {
    let filteredValue = value;

    // Remove spaces if noSpace is true
    if (noSpace) {
        filteredValue = filteredValue.replace(/\s+/g, "");
    }

    // Filter based on input type
    switch (type) {
        case "number":
            // Allow only numeric values
            filteredValue = filteredValue.replace(/[^0-9]/g, "");
            break;
        case "alphaNum":
            // Allow only alphanumeric values
            filteredValue = filteredValue.replace(/[^a-zA-Z0-9]/g, "");
            break;
        case "email":
            // Allow only valid email characters
            filteredValue = filteredValue.replace(/[^a-zA-Z0-9@._-]/g, "");
            break;
        case "tel":
            // Allow only numeric values and optional "+" for phone numbers
            filteredValue = filteredValue.replace(/[^0-9+]/g, "");
            break;
        case "text":
        default:
            // No additional filtering for text or other types
            break;
    }

    return filteredValue;
}
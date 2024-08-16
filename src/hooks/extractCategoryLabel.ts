export const extractLabel = (label: string) => {
    const parts = label.split("/");
    return parts.length > 1 && parts[1].trim() !== "" ? parts[1] : null;
};

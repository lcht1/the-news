export const extractCategoryLabel = (label: string) => {
    if (label) {
        const parts = label?.split("/");
        return parts.length > 1 && parts[1].trim() !== "" ? parts[1] : null;
    }
};

export const getColSpanClass = (index: number, length: number) =>
    index === 0 || index === length - 1 ? "col-span-2" : "col-span-1";

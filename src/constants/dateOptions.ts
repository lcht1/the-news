export const dateOptions = [
    { label: "Any date", value: null },
    { label: "In the last 24h", value: Date.now() - 24 * 60 * 60 * 1000 },
    { label: "In the last week", value: Date.now() - 7 * 24 * 60 * 60 * 1000 },
    {
        label: "In the last month",
        value: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
];

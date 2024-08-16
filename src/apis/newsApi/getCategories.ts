import newsApi from ".";

type Response = {
    uri: string;
    label: string;
    parentUri: string;
}[];

export async function getCategories(prefix?: string): Promise<Response> {
    const response = await newsApi.get(`/suggestCategoriesFast`, {
        params: {
            apiKey: import.meta.env.VITE_NEWS_API_KEY,
            prefix,
        },
    });
    return response.data;
}

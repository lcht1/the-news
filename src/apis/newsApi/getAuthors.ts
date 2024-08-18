import newsApi from ".";

type Response = {
    uri: string;
    name: string;
}[];

export async function getAuthors(prefix?: string): Promise<Response> {
    const response = await newsApi.get(`/suggestAuthorsFast`, {
        params: {
            apiKey: import.meta.env.VITE_NEWS_API_KEY,
            prefix,
        },
    });
    return response.data;
}

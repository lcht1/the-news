import newsApi from ".";

type Response = {
    uri: string;
    title: string;
    parentUri: string;
}[];

export async function getSources(prefix?: string): Promise<Response> {
    const response = await newsApi.get(`/suggestSourcesFast`, {
        params: {
            apiKey: import.meta.env.VITE_NEWS_API_KEY,
            prefix,
        },
    });
    return response.data;
}

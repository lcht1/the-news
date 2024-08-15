import newsOrgApi from ".";

type Params = {
    country?: string;
    category?: string;
    sources?: string;
    q?: string;
    pageSize?: number;
    page?: number;
};
type Response = {
    status: string;
    totalResults: number;
    articles: {
        source: {
            id: string;
            name: string;
        };
        author: string;
        title: string;
        description: string;
        url: string;
        urlToImage: string;
        publishedAt: string;
        content: string;
    }[];
};

export async function getTopHeadlines(props: Params): Promise<Response> {
    const response = await newsOrgApi.get(`/top-headlines`, {
        params: {
            apiKey: import.meta.env.VITE_NEWS_ORG_API_KEY,
            props,
        },
    });
    return response.data;
}

import newsApi from ".";

type Params = {
    apiKey: string;
    articlesPage: number;
    articlesCount: number;
    articlesSortBy: string;
    query: string;
    categoryUri: string;
    sourceUri: string;
    authorUri: string;
};

type Article = {
    uri: string;
    lang: string;
    isDuplicate: boolean;
    date: string;
    time: string;
    dateTime: string;
    dateTimePub: string;
    dataType: string;
    sim: number;
    url: string;
    title: string;
    body: string;
    source: {
        uri: string;
        dataType: string;
        title: string;
    };
    authors: string[];
    concepts: {
        uri: string;
        type: string;
        score: number;
        label: {
            eng: string;
        };
        location?: {
            type: string;
            label: {
                eng: string;
            };
            country: {
                type: string;
                label: {
                    eng: string;
                };
            };
        };
    }[];
    image: string;
    eventUri: string | null;
    shares: Record<string, unknown>;
    sentiment: number;
    wgt: number;
    relevance: number;
};

type Response = {
    results: Article[];
    totalResults: number;
    page: number;
    count: number;
    pages: number;
};

export async function getArticles(props: Params): Promise<Response> {
    const response = await newsApi.get(`/top-headlines`, {
        params: {
            apiKey: import.meta.env.VITE_NEWS_ORG_API_KEY,
            props,
        },
    });
    return response.data;
}

import newsOrgApi from ".";

type Media = {
    type: string;
    caption: string;
    copyright: string;
    "media-metadata": {
        url: string;
        format: string;
        height: number;
        width: number;
    }[];
};

type Result = {
    uri: string;
    url: string;
    id: number;
    asset_id: number;
    source: string;
    published_date: string;
    updated: string;
    section: string;
    subsection: string;
    type: string;
    title: string;
    media: Media[];
};
type Response = {
    status: string;
    copyright: string;
    num_results: number;
    results: Result[];
};

export async function getMostPopular(): Promise<Response> {
    const response = await newsOrgApi.get(`/top-headlines`, {
        params: {
            apiKey: import.meta.env.VITE_THE_NEW_YORK_TIMES_API_KEY,
        },
    });
    return response.data;
}

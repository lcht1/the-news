import { useQueries } from "@tanstack/react-query";
import { getArticles } from "../apis/newsApi/getArticles";

type Preference = {
    uri: string;
    label?: string;
    name?: string;
};

type UseArticlesByPreferencesProps = {
    categories: Preference[];
    sources: Preference[];
    authors: Preference[];
    page?: number;
};

export const useArticlesByPreferences = ({
    categories,
    sources,
    authors,
    page = 1,
}: UseArticlesByPreferencesProps) => {
    const PAGE_SIZE = 70;
    const queries = [
        ...categories.map((category) => ({
            queryKey: ["articles", "categories", category.uri, page],
            queryFn: () =>
                getArticles({
                    categoryUri: category.uri,
                    articlesCount: PAGE_SIZE,
                    articlesPage: page,
                }),
            staleTime: 1000 * 60 * 60 * 10,
        })),
        ...sources.map((source) => ({
            queryKey: ["articles", "sources", source.uri, page],
            queryFn: () =>
                getArticles({
                    sourceUri: source.uri,
                    articlesCount: PAGE_SIZE,
                    articlesPage: page,
                }),
            staleTime: 1000 * 60 * 60 * 10,
        })),
        ...authors.map((author) => ({
            queryKey: ["articles", "authors", author.uri, page],
            queryFn: () =>
                getArticles({
                    authorUri: author.uri,
                    articlesCount: PAGE_SIZE,
                    articlesPage: page,
                }),
            staleTime: 1000 * 60 * 60 * 10,
        })),
    ];

    const articleQueries = useQueries({ queries });

    const isPreferredArticlesLoading = articleQueries.some(
        (query) => query.isLoading
    );

    const hasError = articleQueries.some((query) => query.isError);

    const preferredArticles = articleQueries
        .map((query) => query.data?.articles.results)
        .flat()
        .filter(
            (article) =>
                article && !article.isDuplicate && article.image !== null
        );

    return {
        preferredArticles,
        isPreferredArticlesLoading,
        hasError,
    };
};

import { useQueries } from "@tanstack/react-query";
import { getArticles } from "../apis/newsApi/getArticles";

type Category = { label?: string | null; uri?: string };
export const useArticlesByDisplayedCategories = (
    displayedCategories: Category[]
) => {
    const articleQueries = useQueries({
        queries: displayedCategories.map((category) => ({
            queryKey: ["articles", category.uri],
            queryFn: () =>
                getArticles({ categoryUri: category.uri, articlesCount: 12 }),
            staleTime: 1000 * 60 * 60 * 10,
        })),
    });
    const isResultsWithCategoriesLoading = articleQueries.some(
        (query) => query.isLoading
    );
    const hasError = articleQueries.some((query) => query.isError);

    const articlesWithCategories = articleQueries
        .map((query, index) => {
            if (query.isSuccess) {
                const filteredResults = query.data.articles.results.filter(
                    (result) => !result.isDuplicate && result.image !== null
                );
                return {
                    categoryLabel: displayedCategories[index].label,
                    categoryUri: displayedCategories[index].uri,
                    results: filteredResults,
                };
            }
            return null;
        })
        .filter((item) => item?.categoryLabel);

    return { articlesWithCategories, isResultsWithCategoriesLoading, hasError };
};

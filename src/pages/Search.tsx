import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useSearchParams } from "react-router-dom";
import { getArticles } from "../apis/newsApi/getArticles";
import { getCategories } from "../apis/newsApi/getCategories";
import { getSources } from "../apis/newsApi/getSources";
import { ArticleCard } from "../components/ArticleCard";
import { FilterDropdown, Option } from "../components/FilterDropdown";
import { Header } from "../components/Header";
import { InputAutocomplete, Suggestion } from "../components/InputAutocomplete";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { Pagination } from "../components/Pagination";
import { dateOptions } from "../constants/dateOptions";
import { timeAgo } from "../utils/timeAgo";

const PAGE_SIZE = 50;

export const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Option | null>(null);
    const [selectedSource, setSelectedSource] = useState<Suggestion>(
        {} as Suggestion
    );
    const [selectedCategory, setSelectedCategory] = useState<Suggestion>(
        {} as Suggestion
    );

    const dateStart =
        selectedDate?.value &&
        format(new Date(selectedDate.value), "yyyy-MM-dd");

    const { data: articlesList, isLoading: isArticlesLoading } = useQuery({
        queryKey: [
            `article`,
            { selectedCategory, dateStart, selectedSource, currentPage, query },
        ],
        queryFn: () =>
            getArticles({
                categoryUri: selectedCategory.uri,
                ...(dateStart ? { dateStart } : {}),
                articlesCount: PAGE_SIZE,
                sourceUri: selectedSource.uri,
                articlesPage: currentPage,
                ...(query ? { keyword: query } : {}),
            }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const filteredArticles = useMemo(() => {
        return articlesList?.articles.results.filter(
            (article) => !article.isDuplicate && article.title
        );
    }, [articlesList]);

    useEffect(() => {
        if (currentPage !== 1) setCurrentPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSource, selectedDate]);
    return (
        <>
            <Header />
            <main className="max-w-screen-md xl:max-w-screen-xl lg:max-w-screen-lg m-4 md:m-auto md:my-4 ">
                <div className="flex-col mb-10">
                    <span className="text-blue font-sans font-bold">
                        Filter by:
                    </span>
                    <div className="flex gap-2 flex-col md:flex-row">
                        <FilterDropdown
                            label="Date"
                            options={dateOptions}
                            selectedOption={selectedDate?.label}
                            onOptionSelect={setSelectedDate}
                        />
                        <InputAutocomplete
                            fetchSuggestions={getSources}
                            onSuggestionClick={setSelectedSource}
                            placeholder="Search source"
                            valueKey="uri"
                            labelKey="title"
                        />
                        <InputAutocomplete
                            fetchSuggestions={getCategories}
                            onSuggestionClick={setSelectedCategory}
                            placeholder="Search category"
                            valueKey="uri"
                            labelKey="label"
                            extractLabel
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
                    {isArticlesLoading ? (
                        <LoadingSkeleton
                            count={PAGE_SIZE}
                            countLines={4}
                            name="skeleton-search"
                        />
                    ) : filteredArticles?.length === 0 ? (
                        <span className="p-4">No results.</span>
                    ) : (
                        filteredArticles &&
                        filteredArticles.map((result) => (
                            <ArticleCard
                                key={result.uri}
                                publishedAt={timeAgo(result.dateTime)}
                                image={result.image}
                                title={result.title}
                                url={result.url}
                            />
                        ))
                    )}
                </div>
                {filteredArticles?.length && (
                    <Pagination
                        currentPage={currentPage}
                        noMoreItems={
                            articlesList &&
                            articlesList.articles.results.length < PAGE_SIZE
                        }
                        setCurrentPage={() =>
                            setCurrentPage((prev) => prev + 1)
                        }
                    />
                )}
            </main>
        </>
    );
};

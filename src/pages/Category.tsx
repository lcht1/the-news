import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "react-router-dom";
import { getArticles } from "../apis/newsApi/getArticles";
import { getSources } from "../apis/newsApi/getSources";
import { ArrowScrollToUp } from "../components/ArrowScrolToUp";
import { ArticleCard } from "../components/ArticleCard";
import { FilterDropdown, Option } from "../components/FilterDropdown";
import { Header } from "../components/Header";
import { InputAutocomplete, Suggestion } from "../components/InputAutocomplete";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { Pagination } from "../components/Pagination";
import { dateOptions } from "../constants/dateOptions";
import useCategories from "../hooks/useCategories";
import { useScrollToShow } from "../hooks/useScroll";
import { timeAgo } from "../utils/timeAgo";

const PAGE_SIZE = 50;

export const Category = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Option | null>(null);
    const [selectedSource, setSelectedSource] = useState<Suggestion>(
        {} as Suggestion
    );
    const dateStart = selectedDate?.value
        ? format(new Date(selectedDate.value), "yyyy-MM-dd")
        : undefined;

    const { uri, category } = useParams();
    const {
        data: articlesList,
        isLoading: isArticlesLoading,
        error: articlesError,
    } = useQuery({
        queryKey: [
            `article`,
            { category, dateStart, selectedSource, currentPage },
        ],
        queryFn: () =>
            getArticles({
                categoryUri: `${uri}/${category}`,
                ...(dateStart ? { dateStart } : {}),
                articlesCount: PAGE_SIZE,
                sourceUri: selectedSource.uri,
                articlesPage: currentPage,
            }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const {
        categories: defaultCategories,
        isLoading: isCategoriesLoading,
        error: errorCategories,
    } = useCategories(10);
    const filteredArticles = useMemo(() => {
        return articlesList?.articles.results.filter(
            (article) => !article.isDuplicate && article.title
        );
    }, [articlesList]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDate, selectedSource]);

    const showScrollToTopButton = useScrollToShow();
    return (
        <>
            <Header
                categories={defaultCategories}
                errorCategories={errorCategories}
                isCategoriesLoading={isCategoriesLoading}
            />
            <main className="max-w-screen-md xl:max-w-screen-xl lg:max-w-screen-lg m-4 md:m-auto md:my-4">
                <div className="flex-col mb-10">
                    <span className="text-blue font-sans font-bold">
                        Filter by:
                    </span>
                    <div className="flex gap-2 flex-col md:flex-row md:w-1/3">
                        <FilterDropdown
                            label="Date"
                            options={dateOptions}
                            selectedOption={selectedDate?.label}
                            onOptionSelect={setSelectedDate}
                        />
                        <InputAutocomplete
                            fetchSuggestions={getSources}
                            onSuggestionClick={setSelectedSource}
                            placeholder="Search sources"
                            valueKey="uri"
                            labelKey="title"
                        />
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <div className="w-1 h-6 bg-blue mr-2"></div>
                    <h4 className="w-full flex flex-row items-center gap-2 cursor-pointer font-serif font-bold text-3xl text-gray mr-4">
                        {category}
                    </h4>
                </div>

                <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
                    {isArticlesLoading ? (
                        <LoadingSkeleton
                            count={12}
                            height={200}
                            name="skeleton"
                        />
                    ) : articlesError ? (
                        <p className="p-4 font-bold text-xs text-red">
                            Failed to load articles. Try again later.
                        </p>
                    ) : filteredArticles?.length ? (
                        filteredArticles.map((article) => (
                            <ArticleCard
                                key={article.uri}
                                publishedAt={timeAgo(article.dateTime)}
                                image={article.image}
                                title={article.title}
                                url={article.url}
                            />
                        ))
                    ) : (
                        !isArticlesLoading && <span>No results.</span>
                    )}
                </div>
                {showScrollToTopButton && (
                    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
                        <ArrowScrollToUp />
                    </div>
                )}

                {filteredArticles && filteredArticles?.length > 0 && (
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

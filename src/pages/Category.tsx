import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "react-router-dom";
import { getArticles } from "../apis/newsApi/getArticles";
import { getSources } from "../apis/newsApi/getSources";
import { ArticleCard } from "../components/ArticleCard";
import { FilterDropdown, Option } from "../components/FilterDropdown";
import { Header } from "../components/Header";
import { InputAutocomplete } from "../components/InputAutocomplete";
import { dateOptions } from "../constants/dateOptions";
import { timeAgo } from "../utils/timeAgo";

type Source = {
    uri: string;
    title: string;
};
export const Category = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 100;
    const [selectedDate, setSelectedDate] = useState<Option | null>(null);
    const [selectedSource, setSelectedSource] = useState<Source>({} as Source);
    const dateStart =
        selectedDate?.value &&
        format(new Date(selectedDate.value), "yyyy-MM-dd");

    const { uri, category } = useParams();
    const { data: articlesList, isLoading: isArticlesLoading } = useQuery({
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

    const filteredArticle = useMemo(() => {
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
                        <InputAutocomplete<Source>
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
                <div className="grid md:grid-cols-2 grid-cols-1">
                    {isArticlesLoading
                        ? Array(20)
                              .fill(0)
                              .map((_, index) => (
                                  <div className="p-4" key={index}>
                                      <Skeleton count={4} />
                                  </div>
                              ))
                        : filteredArticle?.map((result, index) => (
                              <>
                                  <ArticleCard
                                      key={index}
                                      publishedAt={timeAgo(result.dateTime)}
                                      image={result.image}
                                      title={result.title}
                                      url={result.url}
                                      variant="row"
                                  />
                              </>
                          ))}
                </div>
                {filteredArticle?.length ? (
                    <div className="flex justify-between items-center mt-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-4 py-2 bg-blue-500 text-gray rounded-md"
                        >
                            Previous
                        </button>
                        <span>Page {currentPage}</span>
                        <button
                            disabled={
                                articlesList &&
                                articlesList.articles.results.length < PAGE_SIZE
                            }
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-4 py-2 bg-blue-500 text-gray rounded-md"
                        >
                            Next
                        </button>
                    </div>
                ) : (
                    <span>No results.</span>
                )}
            </main>
        </>
    );
};

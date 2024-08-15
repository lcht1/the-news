import { useQuery } from "@tanstack/react-query";
import { Header } from "../components/Header";
import { useMemo } from "react";
import { getMostPopularOnTheLastDay } from "../apis/theNewYorkTimesApi/getMostPopularOnTheLastDay";
import { PopularArticleCard } from "../components/PopularArticleCard";
import ClipLoader from "react-spinners/ClipLoader";
import { getTopHeadlines } from "../apis/newsOrgApi/getTopHeadlines";
import { AsideArticleCard } from "../components/AsideArticleCard";
import { timeAgo } from "../utils/timeAgo";
import { getCategories } from "../apis/newsApi/getCategories";
import { useArticlesByDisplayedCategories } from "../hooks/useArticlesByDisplayedCategories";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";

export const Home = () => {
    const navigate = useNavigate();

    const extractLabel = (label: string) => {
        const parts = label.split("/");
        return parts.length > 1 && parts[1].trim() !== "" ? parts[1] : null;
    };

    const {
        data: categories,
        isLoading: isCategoriesLoading,
        error: errorCategories,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        refetchOnMount: false,

        staleTime: 1000 * 60 * 60 * 10,
    });

    const displayedCategories = useMemo(() => {
        return categories
            ? categories.slice(0, 10).map((category) => ({
                  ...category,
                  label: extractLabel(category.label),
              }))
            : [];
    }, [categories]);

    const { data: mostPopular, isLoading: isMostPopularLoading } = useQuery({
        queryKey: ["mostPopular"],
        queryFn: () => getMostPopularOnTheLastDay(),
        staleTime: 1000 * 60 * 60 * 10,
    });

    const topFourMostPopularArticles = useMemo(() => {
        return mostPopular?.results.slice(0, 6);
    }, [mostPopular]);

    const filteredMostPopularArticles = useMemo(() => {
        return topFourMostPopularArticles?.map((article) => ({
            id: article.id,
            title: article.title,
            abstract: article.abstract,
            url: article.url,
            photos: article.media.flatMap((media) =>
                media["media-metadata"].map((meta) => meta.url)
            ),
        }));
    }, [topFourMostPopularArticles]);

    const { data: topHeadlines, isLoading: isTopHeadlinesLoading } = useQuery({
        queryKey: ["topHeadlines"],
        queryFn: () => getTopHeadlines({ language: "en", pageSize: 10 }),
        staleTime: 1000 * 60 * 60 * 10,
    });

    const articlesWithCategories =
        useArticlesByDisplayedCategories(displayedCategories);

    return (
        <>
            <Header
                categories={displayedCategories}
                isCategoriesLoading={isCategoriesLoading}
                errorCategories={errorCategories}
            />
            <main className="max-w-screen-md xl:max-w-screen-xl lg:max-w-screen-lg m-4 md:m-auto md:my-4 ">
                <section className="grid grid-cols-1 gap-y-4 lg:gap-4 lg:grid-cols-4 ">
                    {isMostPopularLoading ? (
                        <div className="m-auto col-span-4">
                            <ClipLoader />
                        </div>
                    ) : (
                        filteredMostPopularArticles?.map((article, index) => (
                            <div
                                key={article.id}
                                className={`${
                                    index === 0
                                        ? "col-span-2"
                                        : index ===
                                          filteredMostPopularArticles.length - 1
                                        ? "col-span-2"
                                        : "col-span-1"
                                }`}
                            >
                                <PopularArticleCard
                                    title={article.title}
                                    abstract={article.abstract}
                                    photos={article.photos}
                                    url={article.url}
                                />
                            </div>
                        ))
                    )}
                </section>
                <div className="grid md:grid-cols-4 grid-cols-2 mt-12">
                    <section className="col-span-3 order-2 md:order-1">
                        {!filteredMostPopularArticles ? (
                            <div className="m-auto col-span-4">
                                <ClipLoader />
                            </div>
                        ) : (
                            articlesWithCategories?.map((article) => (
                                <div className="my-4">
                                    <div className="flex items-center">
                                        <div className="w-1 h-6 bg-blue mr-2"></div>
                                        <h4
                                            className="w-full flex flex-row items-center gap-2 cursor-pointer font-serif font-bold text-3xl text-gray mr-4"
                                            onClick={() =>
                                                navigate(
                                                    `/category?${article?.categoryUri}`
                                                )
                                            }
                                        >
                                            {article?.categoryLabel}
                                            <MdKeyboardArrowRight
                                                size={24}
                                                className="mt-2"
                                            />
                                        </h4>
                                    </div>
                                    <div className="grid md:grid-cols-3 grid-cols-2">
                                        {article?.results.map((result) => (
                                            <AsideArticleCard
                                                key={result.uri}
                                                publishedAt={timeAgo(
                                                    result.dateTime
                                                )}
                                                image={result.image}
                                                title={result.title}
                                                url={result.url}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </section>
                    <aside className="md:col-span-1 col-span-2 order-1">
                        <h4 className="p-4 text-xl font-bold text-blue">
                            In case you missed it...
                        </h4>
                        {isTopHeadlinesLoading ? (
                            <ClipLoader />
                        ) : (
                            topHeadlines?.articles.map((article) => (
                                <AsideArticleCard
                                    key={article.title}
                                    author={article.author}
                                    publishedAt={timeAgo(article.publishedAt)}
                                    title={article.title}
                                    url={article.url}
                                />
                            ))
                        )}
                    </aside>
                </div>
            </main>
        </>
    );
};

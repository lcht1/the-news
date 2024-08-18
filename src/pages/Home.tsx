import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { IoIosRefresh } from "react-icons/io";
import { FaPen } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTopHeadlines } from "../apis/newsOrgApi/getTopHeadlines";
import { getMostPopularOnTheLastDay } from "../apis/theNewYorkTimesApi/getMostPopularOnTheLastDay";
import { ArticleCard } from "../components/ArticleCard";
import { Header } from "../components/Header";
import { Suggestion } from "../components/InputAutocomplete";
import { PopularArticleCard } from "../components/PopularArticleCard";
import { PreferencesModal } from "../components/PreferencesModal";
import { useArticlesByDisplayedCategories } from "../hooks/useArticlesByDisplayedCategories";
import { useArticlesByPreferences } from "../hooks/useArticlesByPreferences";
import useCategories from "../hooks/useCategories";

import LoadingSkeleton from "../components/LoadingSkeleton";
import { RootState } from "../store";
import {
    setPreferredAuthors,
    setPreferredCategories,
    setPreferredSources,
} from "../store/preferences.store";
import { customTheme } from "../theme/customTheme";
import { timeAgo } from "../utils/timeAgo";

Modal.setAppElement("#root");

const getColSpanClass = (index: number, length: number) =>
    index === 0 || index === length - 1 ? "col-span-2" : "col-span-1";

export const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const selectedPreferredItems = useSelector((state: RootState) => ({
        sources: state.preferences.preferredSources,
        categories: state.preferences.preferredCategories,
        authors: state.preferences.preferredAuthors,
    }));

    const {
        isPreferredArticlesLoading,
        preferredArticles,
        hasError: errorPreferredArticles,
    } = useArticlesByPreferences({
        categories: selectedPreferredItems.categories,
        authors: selectedPreferredItems.authors,
        sources: selectedPreferredItems.sources,
        page: currentPage,
    });

    const {
        categories: defaultCategories,
        isLoading: isCategoriesLoading,
        error: errorCategories,
    } = useCategories(10);

    const { data: mostPopular, isLoading: isMostPopularLoading } = useQuery({
        queryKey: ["mostPopular"],
        queryFn: getMostPopularOnTheLastDay,
        staleTime: 1000 * 60 * 60 * 10,
    });

    const topFourMostPopularArticles = useMemo(
        () => mostPopular?.results.slice(0, 6),
        [mostPopular]
    );

    const filteredMostPopularArticles = useMemo(
        () =>
            topFourMostPopularArticles?.map((article) => ({
                id: article.id,
                title: article.title,
                abstract: article.abstract,
                url: article.url,
                photos: article.media.flatMap((media) =>
                    media["media-metadata"].map((meta) => meta.url)
                ),
            })),
        [topFourMostPopularArticles]
    );

    const {
        data: topHeadlines,
        isLoading: isTopHeadlinesLoading,
        error: topHeadlineError,
    } = useQuery({
        queryKey: ["topHeadlines"],
        queryFn: () => getTopHeadlines({ language: "en", pageSize: 10 }),
        staleTime: 1000 * 60 * 60 * 10,
    });

    const hasPreferences = [
        selectedPreferredItems.sources,
        selectedPreferredItems.categories,
        selectedPreferredItems.authors,
    ].some((array) => Array.isArray(array) && array.length > 0);

    const { articlesWithCategories, isResultsWithCategoriesLoading, hasError } =
        useArticlesByDisplayedCategories(defaultCategories);

    const handleRefreshPreferredArticles = () =>
        setCurrentPage((prevPage) => prevPage + 1);

    const handleSelect = (
        type: "sources" | "categories" | "authors",
        item: Suggestion
    ) => {
        const updatedItems = [...selectedPreferredItems[type], item];
        dispatch(setPreferredItems(type, updatedItems));
    };

    const handleRemove = (
        type: "sources" | "categories" | "authors",
        index: number
    ) => {
        const updatedItems = [...selectedPreferredItems[type]];
        updatedItems.splice(index, 1);
        dispatch(setPreferredItems(type, updatedItems));
    };

    const setPreferredItems = (
        type: "sources" | "categories" | "authors",
        items: Suggestion[]
    ) => {
        switch (type) {
            case "sources":
                return setPreferredSources(items);
            case "categories":
                return setPreferredCategories(items);
            case "authors":
                return setPreferredAuthors(items);
            default:
                throw new Error("Unknown preference type");
        }
    };

    return (
        <>
            <Header
                categories={defaultCategories}
                isCategoriesLoading={isCategoriesLoading}
                errorCategories={errorCategories}
            />

            <main className="max-w-screen-md xl:max-w-screen-xl lg:max-w-screen-lg m-4 md:m-auto md:my-4">
                <section className="grid grid-cols-1 gap-y-4 lg:gap-4 lg:grid-cols-4">
                    {isMostPopularLoading ? (
                        <LoadingSkeleton
                            count={6}
                            key="most-popular-skeleton"
                            height={200}
                            colspan
                        />
                    ) : (
                        filteredMostPopularArticles?.map((article, index) => (
                            <div
                                key={article.id}
                                className={getColSpanClass(
                                    index,
                                    filteredMostPopularArticles.length
                                )}
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
                {hasPreferences && (
                    <section className="col-span-3 order-2 md:order-1 mt-8">
                        <div className="flex flex-row items-center">
                            <div className="w-1 h-6 bg-blue mr-2"></div>
                            <h4 className="w-full flex flex-row items-center gap-2 cursor-pointer font-serif font-bold text-3xl text-gray mr-4">
                                Based on your preferences
                            </h4>
                            <button
                                onClick={handleRefreshPreferredArticles}
                                className=" text-blue px-4 py-2 rounded flex-row flex items-center gap-1 underline"
                            >
                                Refresh
                                <IoIosRefresh />
                            </button>
                        </div>
                        {isPreferredArticlesLoading ? (
                            <div className="grid md:grid-cols-4 grid-cols-3 gap-4">
                                <LoadingSkeleton
                                    count={12}
                                    height={200}
                                    name="preferred-articles"
                                />
                            </div>
                        ) : errorPreferredArticles ? (
                            <p className="p-4 font-bold text-xs text-red">
                                Failed to load articles. Try again later.
                            </p>
                        ) : preferredArticles.length > 0 ? (
                            <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
                                {preferredArticles.map((article) =>
                                    article ? (
                                        <ArticleCard
                                            key={article.uri}
                                            publishedAt={timeAgo(
                                                article.dateTime
                                            )}
                                            image={article.image}
                                            title={article.title}
                                            url={article.url}
                                            author={article?.authors[0]?.name}
                                            source={article?.source.title}
                                        />
                                    ) : null
                                )}
                            </div>
                        ) : (
                            <p className="text-center text-gray-600 mt-4">
                                Oops, no results found.{" "}
                                <span
                                    className="cursor-pointer text-blue underline"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Change your preferences
                                </span>
                            </p>
                        )}
                    </section>
                )}
                <div className="grid md:grid-cols-4 grid-cols-2 mt-12">
                    <section className="col-span-3 order-2 md:order-1">
                        {isResultsWithCategoriesLoading ? (
                            <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                                <LoadingSkeleton
                                    count={30}
                                    height={200}
                                    name="results-categories-skeleton"
                                />
                            </div>
                        ) : hasError ? (
                            <p className="p-4 font-bold text-xs text-red">
                                Failed to load articles. Try again later.
                            </p>
                        ) : (
                            articlesWithCategories?.map((article) => (
                                <div
                                    className="my-4"
                                    key={article?.categoryUri}
                                >
                                    <div className="flex items-center">
                                        <div className="w-1 h-6 bg-blue mr-2"></div>
                                        <h4
                                            className="w-full flex flex-row items-center gap-2 cursor-pointer font-serif font-bold text-3xl text-gray mr-4"
                                            onClick={() =>
                                                navigate(
                                                    `/category/${article?.categoryUri}`
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
                                    <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                                        {article?.results?.map((result) => (
                                            <ArticleCard
                                                key={result.uri}
                                                publishedAt={timeAgo(
                                                    result.dateTime
                                                )}
                                                image={result.image}
                                                title={result.title}
                                                url={result.url}
                                                author={
                                                    result?.authors[0]?.name
                                                }
                                                source={result?.source.title}
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
                            <LoadingSkeleton
                                count={6}
                                key="top-headlines-skeleton"
                                countLines={4}
                            />
                        ) : topHeadlineError ? (
                            <p className="p-4 font-bold text-xs text-red">
                                Failed to load articles. Try again later.
                            </p>
                        ) : (
                            topHeadlines?.articles.map((article) => (
                                <ArticleCard
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

                <div className="fixed bottom-4 right-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue rounded-full p-4 shadow-lg"
                    >
                        <FaPen size={20} color={customTheme.colors.white} />
                    </button>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    shouldCloseOnOverlayClick
                    contentLabel="Configurar Preferências"
                    className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                    <PreferencesModal
                        onRequestClose={() => setIsModalOpen(false)}
                        selectedItems={selectedPreferredItems}
                        onSelect={{
                            source: (source) => handleSelect("sources", source),
                            category: (category) =>
                                handleSelect("categories", category),
                            author: (author) => handleSelect("authors", author),
                        }}
                        onRemove={{
                            source: (index) => handleRemove("sources", index),
                            category: (index) =>
                                handleRemove("categories", index),
                            author: (index) => handleRemove("authors", index),
                        }}
                    />
                </Modal>
            </main>
        </>
    );
};

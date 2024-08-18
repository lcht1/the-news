import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { IoIosRefresh, IoMdSettings } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
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

    const selectedItems = useSelector((state: RootState) => ({
        sources: state.preferences.preferredSources,
        categories: state.preferences.preferredCategories,
        authors: state.preferences.preferredAuthors,
    }));

    const { isPreferredArticlesLoading, preferredArticles } =
        useArticlesByPreferences({
            categories: selectedItems.categories,
            authors: selectedItems.authors,
            sources: selectedItems.sources,
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

    const { data: topHeadlines, isLoading: isTopHeadlinesLoading } = useQuery({
        queryKey: ["topHeadlines"],
        queryFn: () => getTopHeadlines({ language: "en", pageSize: 10 }),
        staleTime: 1000 * 60 * 60 * 10,
    });

    const hasPreferences = [
        selectedItems.sources,
        selectedItems.categories,
        selectedItems.authors,
    ].some((array) => Array.isArray(array) && array.length > 0);

    const { articlesWithCategories, isResultsWithCategoriesLoading } =
        useArticlesByDisplayedCategories(defaultCategories);

    const handleRefreshPreferredArticles = () =>
        setCurrentPage((prevPage) => prevPage + 1);

    const handleSave = () => {
        dispatch(setPreferredSources(selectedItems.sources));
        dispatch(setPreferredCategories(selectedItems.categories));
        dispatch(setPreferredAuthors(selectedItems.authors));
        setIsModalOpen(false);
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
                    {isMostPopularLoading
                        ? Array(6)
                              .fill(0)
                              .map((_, index) => (
                                  <div
                                      className={getColSpanClass(index, 6)}
                                      key={index}
                                  >
                                      <Skeleton height={200} />
                                  </div>
                              ))
                        : filteredMostPopularArticles?.map((article, index) => (
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
                          ))}
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
                            Array(3)
                                .fill(0)
                                .map((_, index) => (
                                    <div className="my-4" key={index}>
                                        <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
                                            {Array(6)
                                                .fill(0)
                                                .map((_, index) => (
                                                    <Skeleton
                                                        key={index}
                                                        height={200}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                ))
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
                        {isResultsWithCategoriesLoading
                            ? Array(3)
                                  .fill(0)
                                  .map((_, index) => (
                                      <div className="my-4" key={index}>
                                          <Skeleton count={1} width={100} />
                                          <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                                              {Array(6)
                                                  .fill(0)
                                                  .map((_, index) => (
                                                      <Skeleton
                                                          key={index}
                                                          height={200}
                                                      />
                                                  ))}
                                          </div>
                                      </div>
                                  ))
                            : articlesWithCategories?.map((article, index) => (
                                  <div className="my-4" key={index}>
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
                              ))}
                    </section>

                    <aside className="md:col-span-1 col-span-2 order-1">
                        <h4 className="p-4 text-xl font-bold text-blue">
                            In case you missed it...
                        </h4>
                        {isTopHeadlinesLoading
                            ? Array(6)
                                  .fill(0)
                                  .map((_, index) => (
                                      <div className="p-2" key={index}>
                                          <Skeleton count={4} />
                                      </div>
                                  ))
                            : topHeadlines?.articles.map((article) => (
                                  <ArticleCard
                                      key={article.title}
                                      author={article.author}
                                      publishedAt={timeAgo(article.publishedAt)}
                                      title={article.title}
                                      url={article.url}
                                  />
                              ))}
                    </aside>
                </div>

                <div className="fixed bottom-4 right-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue rounded-full p-4 shadow-lg"
                    >
                        <IoMdSettings
                            size={30}
                            color={customTheme.colors.white}
                        />
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
                        selectedItems={selectedItems}
                        onSelect={{
                            source: (source: Suggestion) => {
                                dispatch(
                                    setPreferredSources([
                                        ...selectedItems.sources,
                                        source,
                                    ])
                                );
                            },
                            category: (category: Suggestion) => {
                                dispatch(
                                    setPreferredCategories([
                                        ...selectedItems.categories,
                                        category,
                                    ])
                                );
                            },
                            author: (author: Suggestion) => {
                                dispatch(
                                    setPreferredAuthors([
                                        ...selectedItems.authors,
                                        author,
                                    ])
                                );
                            },
                        }}
                        onRemove={{
                            source: (index: number) => {
                                const updatedSources = [
                                    ...selectedItems.sources,
                                ];
                                updatedSources.splice(index, 1);
                                dispatch(setPreferredSources(updatedSources));
                            },
                            category: (index: number) => {
                                const updatedCategories = [
                                    ...selectedItems.categories,
                                ];
                                updatedCategories.splice(index, 1);
                                dispatch(
                                    setPreferredCategories(updatedCategories)
                                );
                            },
                            author: (index: number) => {
                                const updatedAuthors = [
                                    ...selectedItems.authors,
                                ];
                                updatedAuthors.splice(index, 1);
                                dispatch(setPreferredAuthors(updatedAuthors));
                            },
                        }}
                        handleSave={handleSave}
                    />
                </Modal>
            </main>
        </>
    );
};

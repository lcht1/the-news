import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { getTopHeadlines } from "../apis/newsOrgApi/getTopHeadlines";
import { getMostPopularOnTheLastDay } from "../apis/theNewYorkTimesApi/getMostPopularOnTheLastDay";
import { ArticleCard } from "../components/ArticleCard";
import { Header } from "../components/Header";
import { PopularArticleCard } from "../components/PopularArticleCard";
import { useArticlesByDisplayedCategories } from "../hooks/useArticlesByDisplayedCategories";
import useCategories from "../hooks/useCategories";
import { timeAgo } from "../utils/timeAgo";

export const Home = () => {
    const navigate = useNavigate();

    const {
        categories,
        isLoading: isCategoriesLoading,
        error: errorCategories,
    } = useCategories();

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

    const { articlesWithCategories, isResultsWithCategoriesLoading } =
        useArticlesByDisplayedCategories(categories);

    const getColSpanClass = (index: number, length: number) => {
        if (index === 0 || index === length - 1) {
            return "col-span-2";
        }
        return "col-span-1";
    };
    return (
        <>
            <Header
                categories={categories}
                isCategoriesLoading={isCategoriesLoading}
                errorCategories={errorCategories}
            />
            <main className="max-w-screen-md xl:max-w-screen-xl lg:max-w-screen-lg m-4 md:m-auto md:my-4 ">
                <section className="grid grid-cols-1 gap-y-4 lg:gap-4 lg:grid-cols-4 ">
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
                                          {article?.results.map((result) => (
                                              <ArticleCard
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
            </main>
        </>
    );
};

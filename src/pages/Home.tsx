import { useQuery } from "@tanstack/react-query";
import { Header } from "../components/Header";
import { useMemo } from "react";
import { getMostPopularOnTheLastDay } from "../apis/theNewYorkTimesApi/getMostPopularOnTheLastDay";
import { PopularArticleCard } from "../components/PopularArticleCard";
import ClipLoader from "react-spinners/ClipLoader";

export const Home = () => {
    const { data: mostPopular, isLoading: isMostPopularLoading } = useQuery({
        queryKey: ["mostPopular"],
        queryFn: () => getMostPopularOnTheLastDay(),
        refetchInterval: 1000 * 60 * 60 * 10,
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
    return (
        <>
            <Header />
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
            </main>
        </>
    );
};

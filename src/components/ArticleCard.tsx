type Props = {
    title: string;
    publishedAt: string;
    url: string;
    author?: string;
    image?: string;
    variant?: "row" | "column";
};
export const ArticleCard = ({
    title,
    publishedAt,
    url,
    author,
    image,
    variant = "column",
}: Props) => {
    return (
        <div
            onClick={() => window.open(url)}
            className={`cursor-pointer border-b-2 border-light-gray p-4 ${
                variant === "row" && "flex flex-row gap-4"
            }`}
        >
            {image ? (
                <img
                    src={image}
                    alt={`Image of the article: ${title}`}
                    className={` ${
                        variant === "row"
                            ? "w-40 h-40"
                            : "w-full h-28 md:h-40 lg:h-58"
                    }`}
                />
            ) : null}
            <div className="flex flex-col justify-between">
                <h3 className="font-bold hover:underline text-sm">{title}</h3>
                <div>
                    <span className="text-xs">{publishedAt}</span>
                    {author ? (
                        <span className="text-blue text-xs">|{author}</span>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

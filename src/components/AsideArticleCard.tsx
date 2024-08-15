type Props = {
    title: string;
    publishedAt: string;
    url: string;
    author?: string;
    image?: string;
};
export const AsideArticleCard = ({
    title,
    publishedAt,
    url,
    author,
    image,
}: Props) => {
    return (
        <div
            onClick={() => window.open(url)}
            className="cursor-pointer border-b-2 border-light-gray p-4"
        >
            {image ? (
                <img
                    src={image}
                    alt={`Image of the article: ${title}`}
                    className="w-full h-28 md:h-40 lg:h-58"
                />
            ) : null}
            <h3 className="font-bold hover:underline text-sm">{title}</h3>
            <div>
                <span className="text-xs">{publishedAt}</span>
                {author ? (
                    <span className="text-blue text-xs">|{author}</span>
                ) : null}
            </div>
        </div>
    );
};

type Props = {
    title: string;
    abstract: string;
    url: string;
    photos: string[];
};
export const PopularArticleCard = ({ title, abstract, url, photos }: Props) => {
    const backgroundImage = photos[2] || "";

    return (
        <div
            onClick={() => window.open(url)}
            className="relative w-full h-60 bg-cover bg-center rounded-lg overflow-hidden hover:scale-105 transition-all delay-450 duration-300 cursor-pointer"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="flex-col absolute inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4">
                <h3 className="text-white text-lg font-bold">{title}</h3>
                <p className="text-white text-sm font-medium">
                    {abstract.length > 80
                        ? `${abstract.slice(0, 80)}...`
                        : abstract}
                </p>
            </div>
        </div>
    );
};

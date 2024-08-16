import { useNavigate } from "react-router-dom";
import { SearchInput } from "./SearchInput";

type Props = {
    categories?: { label: string | null; uri: string }[];
    isCategoriesLoading?: boolean;
    errorCategories?: unknown;
};
export const Header = ({
    categories,
    isCategoriesLoading,
    errorCategories,
}: Props) => {
    const navigate = useNavigate();

    const handleSearch = (query: string) => {
        navigate(`/search?query=${encodeURIComponent(query)}`);
    };
    return (
        <header className="bg-white ">
            <div className=" flex-col justify-between items-center">
                <div className="flex flex-col sm:flex-row justify-around p-4 items-center">
                    <h1
                        className="cursor-pointer font-serif text-gray text-4xl font-bold  mb-2"
                        onClick={() => navigate("/")}
                    >
                        The News
                    </h1>
                    <SearchInput onSearch={handleSearch} />
                </div>
                {categories ? (
                    <nav className="bg-gray  flex justify-center relative h-20 p-3">
                        <ul className="flex space-x-4 flex-wrap max-w-3xl  content-center items-center justify-center gap-1.5">
                            {isCategoriesLoading ? (
                                <div className="text-white">
                                    Loading categories...
                                </div>
                            ) : errorCategories ? (
                                <div className="text-red-500">
                                    Error loading categories.
                                </div>
                            ) : (
                                <ul className="flex space-x-4 flex-wrap max-w-3xl content-center items-center justify-center gap-1.5">
                                    {categories.map((category, index) => {
                                        return (
                                            <li key={index}>
                                                <a
                                                    onClick={() =>
                                                        navigate(
                                                            `category/${category.uri}`
                                                        )
                                                    }
                                                    className="cursor-pointer text-white font-medium text-sm sm:text-lg font-sans hover:underline"
                                                >
                                                    {category.label}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </ul>
                    </nav>
                ) : null}
            </div>
        </header>
    );
};

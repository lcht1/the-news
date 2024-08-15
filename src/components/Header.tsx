import { useQuery } from "@tanstack/react-query";
import { SearchInput } from "./SearchInput";
import { getCategories } from "../apis/newsApi/getCategories";
import { useMemo } from "react";

export const Header = () => {
    const extractLabel = (label: string) => {
        const parts = label.split("/");
        return parts.length > 1 && parts[1].trim() !== "" ? parts[1] : null;
    };

    const {
        data: categories,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        refetchOnMount: false,

        staleTime: 1000 * 60 * 60 * 2,
    });

    const displayedCategories = useMemo(() => {
        return categories ? categories.slice(0, 10) : [];
    }, [categories]);

    return (
        <header className="bg-white ">
            <div className=" flex-col justify-between items-center">
                <div className="flex flex-col sm:flex-row justify-around p-4 items-center">
                    <h1 className="font-serif text-gray text-4xl font-bold  mb-2">
                        The News
                    </h1>
                    <SearchInput onSearch={() => {}} />
                </div>
                <nav className="bg-gray  flex justify-center relative h-20 p-3">
                    <ul className="flex space-x-4 flex-wrap max-w-3xl  content-center items-center justify-center gap-1.5">
                        {isLoading ? (
                            <div className="text-white">
                                Loading categories...
                            </div>
                        ) : error ? (
                            <div className="text-red-500">
                                Error loading categories.
                            </div>
                        ) : (
                            <ul className="flex space-x-4 flex-wrap max-w-3xl content-center items-center justify-center gap-1.5">
                                {displayedCategories.map((category, index) => {
                                    const label = extractLabel(category.label);
                                    if (!label) return null;
                                    return (
                                        <li key={index}>
                                            <a
                                                href={category.uri}
                                                className="text-white font-sans hover:underline"
                                            >
                                                {label}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

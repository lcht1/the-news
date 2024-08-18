import { useState } from "react";
import { IoMdSearch } from "react-icons/io";

type Props = {
    placeholder?: string;
    onSearch: (query: string) => void;
};
export const SearchInput = ({
    placeholder = "Type here...",
    onSearch,
}: Props) => {
    const [query, setQuery] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(query);
    };
    return (
        <form onSubmit={handleSearch} className="flex items-center h-8">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="text-sm w-full h-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue"
            />
            <button
                disabled={!query}
                type="submit"
                className="bg-gray text-white font-bold text-sm p-2 rounded-r-md hover:bg-blue-700 h-full flex items-center"
            >
                <IoMdSearch />
            </button>
        </form>
    );
};

import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

type Props<T> = {
    fetchSuggestions: (query: string) => Promise<T[]>;
    onSuggestionClick: (suggestion: T) => void;
    placeholder?: string;
    valueKey: keyof T;
    labelKey: keyof T;
};

export const InputAutocomplete = <T extends Record<string, React.ReactNode>>({
    fetchSuggestions,
    onSuggestionClick,
    placeholder = "Search...",
    valueKey,
    labelKey,
}: Props<T>) => {
    const [inputValue, setInputValue] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const debouncedSearch = debounce((value: string) => {
        setDebouncedInputValue(value);
    }, 1000);

    useEffect(() => {
        debouncedSearch(inputValue);
    }, [inputValue, debouncedSearch]);

    const {
        data: suggestions,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["suggestions", debouncedInputValue],
        queryFn: () => fetchSuggestions(debouncedInputValue),
        enabled: !!debouncedInputValue,
        staleTime: 1000 * 60 * 5,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsDropdownOpen(true);
    };

    const handleSuggestionClick = (suggestion: T) => {
        setInputValue(suggestion[labelKey] as string);
        onSuggestionClick(suggestion);
        setIsDropdownOpen(false);
    };

    const handleClearInput = () => {
        setInputValue("");
        onSuggestionClick({} as T);
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <div className="flex items-center justify-between  w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="bg-white border-none outline-none  text-sm font-medium text-gray-700 placeholder-gray-400 "
                />
                {inputValue ? (
                    <IoMdClose
                        onClick={handleClearInput}
                        className="cursor-pointer"
                    />
                ) : null}
            </div>
            {isDropdownOpen && (
                <div className="z-10 absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    {isLoading ? (
                        <p className="text-sm text-gray-500">Loading...</p>
                    ) : (
                        suggestions?.length === 0 && (
                            <p className="text-sm text-gray-500">No results.</p>
                        )
                    )}
                    {error && (
                        <p className="text-sm text-red-500">
                            Error: {error.message}
                        </p>
                    )}
                    {suggestions && suggestions.length > 0 && (
                        <ul className="py-1">
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion[valueKey] as string}
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                    {suggestion[labelKey]}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

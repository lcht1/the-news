import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { extractCategoryLabel } from "../hooks/extractCategoryLabel";

export type Suggestion = {
    uri: string;
    title?: string;
    label?: string;
    name?: string;
};

type Props = {
    name?: string;
    fetchSuggestions: (query: string) => Promise<Suggestion[]>;
    onSuggestionClick: (suggestion: Suggestion) => void;
    placeholder?: string;
    valueKey: keyof Suggestion;
    labelKey: keyof Suggestion;
    extractLabel?: boolean;
    clearOnSelection?: boolean;
};

const getUniqueLabels = (suggestions: Suggestion[]): Suggestion[] => {
    const uniqueLabels = new Map<string, Suggestion>();

    suggestions.forEach((suggestion) => {
        const parts = suggestion.uri.split("/");
        const key = parts.length > 1 ? parts[1] : parts[0];
        if (!uniqueLabels.has(key)) {
            uniqueLabels.set(key, suggestion);
        }
    });

    return Array.from(uniqueLabels.values());
};

export const InputAutocomplete = ({
    name,
    fetchSuggestions,
    onSuggestionClick,
    placeholder = "Search...",
    valueKey,
    labelKey,
    clearOnSelection = false,
    extractLabel = false,
}: Props) => {
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
        queryKey: ["suggestions", debouncedInputValue, name],
        queryFn: () => fetchSuggestions(debouncedInputValue),
        enabled: !!debouncedInputValue,
        staleTime: 1000 * 60 * 5,
    });

    const uniqueSuggestions = useMemo(
        () => getUniqueLabels(suggestions || []),
        [suggestions]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsDropdownOpen(true);
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        const label = extractLabel
            ? extractCategoryLabel(suggestion[labelKey] as string)
            : (suggestion[labelKey] as string);

        setInputValue(clearOnSelection ? "" : label ?? "");
        onSuggestionClick(suggestion);

        setIsDropdownOpen(false);
    };

    const handleClearInput = () => {
        setInputValue("");
        onSuggestionClick({ uri: "" });
        setIsDropdownOpen(false);
    };

    return (
        <div className="w-full relative inline-block text-left">
            <div className="flex items-center justify-between w-full rounded-md border border-gray shadow-sm px-4 py-1 bg-white">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className=" w-full bg-white border-none outline-none text-xs font-medium text-gray-700 placeholder-gray-400"
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
                        uniqueSuggestions.length === 0 && (
                            <p className="text-sm text-gray-500">No results.</p>
                        )
                    )}
                    {error && (
                        <p className="text-sm text-red-500">
                            Error: {error.message}
                        </p>
                    )}
                    {uniqueSuggestions.map((suggestion) => (
                        <li
                            key={suggestion[valueKey] as string}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            {extractLabel
                                ? extractCategoryLabel(
                                      suggestion[labelKey] as string
                                  )
                                : suggestion[labelKey]}
                        </li>
                    ))}
                </div>
            )}
        </div>
    );
};

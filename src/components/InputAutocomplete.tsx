import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { extractCategoryLabel } from "../hooks/extractCategoryLabel";

export type Suggestion =
    | { uri: string; title?: string; label?: never }
    | { uri: string; title?: never; label: string };

type Props = {
    fetchSuggestions: (query: string) => Promise<Suggestion[]>;
    onSuggestionClick: (suggestion: Suggestion) => void;
    placeholder?: string;
    valueKey: keyof Suggestion;
    labelKey: keyof Suggestion;
    extractLabel?: boolean;
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
    fetchSuggestions,
    onSuggestionClick,
    placeholder = "Search...",
    valueKey,
    labelKey,
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
        queryKey: ["suggestions", debouncedInputValue],
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

        setInputValue(label ?? "");
        onSuggestionClick(suggestion);
        setIsDropdownOpen(false);
    };

    const handleClearInput = () => {
        setInputValue("");
        onSuggestionClick({ uri: "" }); // Ajuste se necessário
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <div className="flex items-center justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="bg-white border-none outline-none text-sm font-medium text-gray-700 placeholder-gray-400"
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

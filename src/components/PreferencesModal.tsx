import { IoMdClose } from "react-icons/io";
import { getCategories } from "../apis/newsApi/getCategories";
import { getSources } from "../apis/newsApi/getSources";
import { InputAutocomplete, Suggestion } from "./InputAutocomplete";
import { getAuthors } from "../apis/newsApi/getAuthors";

type Props = {
    handleSave: () => void;
    onRequestClose: () => void;
    selectedItems: {
        sources: Suggestion[];
        categories: Suggestion[];
        authors: Suggestion[];
    };
    onSelect: {
        source: (source: Suggestion) => void;
        category: (category: Suggestion) => void;
        author: (author: Suggestion) => void;
    };
    onRemove: {
        source: (index: number) => void;
        category: (index: number) => void;
        author: (index: number) => void;
    };
};

export const PreferencesModal = ({
    onRequestClose,
    selectedItems,
    onSelect,
    onRemove,
    handleSave,
}: Props) => {
    const handleSelect = (
        type: "sources" | "categories" | "authors",
        item: Suggestion
    ) => {
        if (type === "sources") {
            onSelect.source(item);
        } else if (type === "categories") {
            onSelect.category(item);
        } else if (type === "authors") {
            onSelect.author(item);
        }
    };

    return (
        <div className="p-3 rounded-lg max-w-3xl w-full ">
            <div className="mb-4">
                <h2 className="text-lg font-bold ">Configure Preferences</h2>
                <span className="text-sm">
                    Customize your preferences to receive tailored content just
                    for you.
                </span>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col ">
                    <div className="flex gap-2 items-center">
                        <span className="text-sm font-bold"> Sources</span>
                        <InputAutocomplete
                            fetchSuggestions={getSources}
                            onSuggestionClick={(item) =>
                                handleSelect("sources", item)
                            }
                            placeholder="Search for sources..."
                            valueKey="uri"
                            labelKey="title"
                            clearOnSelection
                            name="sources"
                        />
                    </div>
                    <ul className="flex flex-row flex-wrap gap-2">
                        {selectedItems.sources.map((source, index) => (
                            <li
                                key={index}
                                className="flex items-center text-xs"
                            >
                                {source.title}
                                <IoMdClose
                                    onClick={() => onRemove.source(index)}
                                    size={10}
                                    className="cursor-pointer text-red-500 ml-1"
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col ">
                    <div className="flex gap-2 items-center">
                        <span className="text-sm font-bold"> Categories</span>

                        <InputAutocomplete
                            fetchSuggestions={getCategories}
                            onSuggestionClick={(item) =>
                                handleSelect("categories", item)
                            }
                            placeholder="Search for categories..."
                            valueKey="uri"
                            labelKey="label"
                            extractLabel
                            clearOnSelection
                            name="categories"
                        />
                    </div>
                    <ul className="flex flex-row flex-wrap gap-2">
                        {selectedItems.categories.map((category, index) => (
                            <li
                                key={index}
                                className="flex items-center text-xs"
                            >
                                {category.label}
                                <IoMdClose
                                    onClick={() => onRemove.category(index)}
                                    size={10}
                                    className="cursor-pointer text-red-500 ml-1"
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col ">
                    <div className="flex gap-2 items-center">
                        <span className="text-sm font-bold">Authors</span>
                        <InputAutocomplete
                            fetchSuggestions={getAuthors}
                            onSuggestionClick={(item) =>
                                handleSelect("authors", item)
                            }
                            placeholder="Search for authors..."
                            valueKey="uri"
                            labelKey="name"
                            clearOnSelection
                            name="authors"
                        />
                    </div>
                    <ul className="flex flex-row flex-wrap gap-2">
                        {selectedItems.authors.map((author, index) => (
                            <li
                                key={index}
                                className="flex items-center text-xs"
                            >
                                {author.title}
                                <IoMdClose
                                    onClick={() => onRemove.author(index)}
                                    size={10}
                                    className="cursor-pointer text-red-500 ml-1"
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-row gap-2 justify-center ">
                    <button
                        className=" rounded-md px-2 text-blue font-bold"
                        onClick={onRequestClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue rounded-md px-2 py-1 text-white font-bold"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

import { IoMdClose } from "react-icons/io";
import { getAuthors } from "../apis/newsApi/getAuthors";
import { getCategories } from "../apis/newsApi/getCategories";
import { getSources } from "../apis/newsApi/getSources";
import { customTheme } from "../theme/customTheme";
import { InputAutocomplete, Suggestion } from "./InputAutocomplete";
import { extractCategoryLabel } from "../hooks/extractCategoryLabel";

type Props = {
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
}: Props) => {
    const isItemSelected = (
        type: "sources" | "categories" | "authors",
        item: Suggestion
    ) => {
        return selectedItems[type].some(
            (selectedItem) => selectedItem.uri === item.uri
        );
    };

    const handleSelect = (
        type: "sources" | "categories" | "authors",
        item: Suggestion
    ) => {
        if (isItemSelected(type, item)) {
            return;
        }

        if (type === "sources") {
            onSelect.source(item);
        } else if (type === "categories") {
            onSelect.category({
                ...item,
                label: extractCategoryLabel(item.label as string) as string,
            });
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
                    <ul className="flex flex-row flex-wrap gap-2 mt-2">
                        {selectedItems.sources.map((source, index) => (
                            <SelectedItem
                                onRemove={() => onRemove.source(index)}
                                title={source.title}
                                uri={source.uri}
                            />
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col ">
                    <div className="flex gap-2 items-center">
                        <span className="text-sm font-bold"> Categories</span>
                        <div className="w-full">
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
                    </div>
                    <ul className="flex flex-row flex-wrap gap-2 mt-2">
                        {selectedItems.categories.map((category, index) => (
                            <SelectedItem
                                onRemove={() => onRemove.category(index)}
                                title={category.label}
                                uri={category.uri}
                            />
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
                    <ul className="flex flex-row flex-wrap gap-2 mt-2">
                        {selectedItems.authors.map((author, index) => (
                            <SelectedItem
                                onRemove={() => onRemove.author(index)}
                                title={author.name}
                                uri={author.uri}
                            />
                        ))}
                    </ul>
                </div>

                <button
                    className="bg-gray rounded-md px-2 py-1 text-white font-bold"
                    onClick={onRequestClose}
                >
                    Ok
                </button>
            </div>
        </div>
    );
};

type SelectedItemProps = {
    uri: string;
    title?: string;
    onRemove: () => void;
};
const SelectedItem = ({ title, onRemove, uri }: SelectedItemProps) => (
    <li
        key={uri}
        className="flex items-center text-xs border-slate-400 border rounded-md p-1"
    >
        {title}
        <IoMdClose
            onClick={onRemove}
            size={10}
            color={customTheme.colors.red}
            className="cursor-pointer text-red-500 ml-1"
        />
    </li>
);

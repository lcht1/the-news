import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

export type Option = {
    label: string;
    value: number | string | null;
};

type Props = {
    label: string;
    options: Option[];
    selectedOption?: string;
    onOptionSelect: (option: Option) => void;
};

export const FilterDropdown = ({
    label,
    options,
    selectedOption,
    onOptionSelect,
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option: Option) => {
        onOptionSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                className="inline-flex justify-between w-full rounded-md border  shadow-sm px-4 py-1 bg-white text-xs font-medium text-gray  focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption || label}
                <MdKeyboardArrowDown
                    className={`ml-2 transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                    }`}
                    size={15}
                />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleOptionClick(option)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

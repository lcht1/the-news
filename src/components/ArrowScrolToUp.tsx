import { scrollToTop } from "../hooks/useScroll";
import { FaArrowUp } from "react-icons/fa";
import { customTheme } from "../theme/customTheme";

export const ArrowScrollToUp = () => {
    return (
        <button
            onClick={scrollToTop}
            className="bg-white rounded-full p-4 shadow-lg"
        >
            <FaArrowUp size={20} color={customTheme.colors.blue} />
        </button>
    );
};

import { useState, useEffect } from "react";

const useScrollToShow = (threshold = 100) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > threshold);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [threshold]);

    return isVisible;
};
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

export { scrollToTop, useScrollToShow };

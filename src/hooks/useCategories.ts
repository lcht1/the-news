import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../apis/newsApi/getCategories";
import { extractLabel } from "./extractCategoryLabel";

const useCategories = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 60 * 10,
    });

    const categories = data
        ? data
              .slice(0, 10)
              .map((category) => ({
                  ...category,
                  label: extractLabel(category.label),
              }))
              .filter((category) => category.label)
        : [];

    return {
        categories,
        isLoading,
        error,
    };
};

export default useCategories;

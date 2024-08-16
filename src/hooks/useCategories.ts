import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../apis/newsApi/getCategories";
import { extractCategoryLabel } from "./extractCategoryLabel";

const useCategories = (size?: number) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
        refetchOnMount: false,
        staleTime: 1000 * 60 * 60 * 10,
    });

    const categories = data
        ? data
              .map((category) => ({
                  ...category,
                  label: extractCategoryLabel(category.label),
              }))
              .filter((category) => category.label)
        : [];

    return {
        categories: size ? categories.slice(0, size) : categories,
        isLoading,
        error,
    };
};

export default useCategories;

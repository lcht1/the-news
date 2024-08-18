type Props = {
    currentPage: number;
    setCurrentPage: () => void;
    noMoreItems?: boolean;
};

export const Pagination = ({
    currentPage,
    noMoreItems,
    setCurrentPage,
}: Props) => {
    return (
        <div className="flex justify-between items-center mt-4">
            <button
                disabled={currentPage === 1}
                onClick={setCurrentPage}
                className="px-4 py-2 bg-blue-500 text-gray rounded-md"
                aria-label="Previous page"
            >
                Previous
            </button>
            <span>Page {currentPage}</span>
            <button
                disabled={noMoreItems}
                onClick={setCurrentPage}
                className="px-4 py-2 bg-blue-500 text-gray rounded-md"
                aria-label="Next page"
            >
                Next
            </button>
        </div>
    );
};

import Skeleton from "react-loading-skeleton";
type Props = {
    count?: number;
    countLines?: number;
    height?: number;
    width?: number;
    name?: string;
    colspan?: boolean;
};

const getColSpanClass = (index: number, length: number) =>
    index === 0 || index === length - 1 ? "col-span-2" : "col-span-1";

export const LoadingSkeleton = ({
    count = 1,
    countLines,
    height,
    width,
    name,
    colspan = false,
}: Props) => {
    return Array(count)
        .fill(0)
        .map((_, index) => (
            <div
                key={`${name}-${index}`}
                className={colspan ? getColSpanClass(index, count) : ""}
            >
                <Skeleton
                    key={`${name}-${index}`}
                    height={height}
                    width={width}
                    count={countLines}
                />
            </div>
        ));
};

export default LoadingSkeleton;

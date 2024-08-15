export const timeAgo = (dateString: string): string => {
    const now = new Date().getTime();
    const date = new Date(dateString).getTime();

    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} sec ago`;
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} h ago`;
    } else {
        return `${diffInDays} days ago`;
    }
};

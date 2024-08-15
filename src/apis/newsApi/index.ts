import axios from "axios";

const newsApi = axios.create({
    baseURL: import.meta.env.VITE_NEWS_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default newsApi;

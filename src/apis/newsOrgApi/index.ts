import axios from "axios";

const newsOrgApi = axios.create({
    baseURL: import.meta.env.VITE_NEWS_ORG_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default newsOrgApi;

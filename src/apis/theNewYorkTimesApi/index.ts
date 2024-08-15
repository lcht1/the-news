import axios from "axios";

const theNewYorkTimesApi = axios.create({
    baseURL: import.meta.env.VITE_THE_NEW_YORK_TIMES_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default theNewYorkTimesApi;

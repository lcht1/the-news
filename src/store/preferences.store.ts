import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Suggestion } from "../components/InputAutocomplete";

type PreferencesState = {
    preferredSources: Suggestion[];
    preferredCategories: Suggestion[];
    preferredAuthors: Suggestion[];
};

export type RootState = {
    preferences: PreferencesState;
};
const initialState = JSON.parse(localStorage.getItem("preferences") || "{}");

const preferencesSlice = createSlice({
    name: "preferences",
    initialState: {
        preferredSources: initialState.preferredSources || [],
        preferredCategories: initialState.preferredCategories || [],
        preferredAuthors: initialState.preferredAuthors || [],
    },
    reducers: {
        setPreferredSources: (state, action: PayloadAction<Suggestion[]>) => {
            state.preferredSources = action.payload;
            localStorage.setItem("preferences", JSON.stringify(state));
        },
        setPreferredCategories: (
            state,
            action: PayloadAction<Suggestion[]>
        ) => {
            state.preferredCategories = action.payload;
            localStorage.setItem("preferences", JSON.stringify(state));
        },
        setPreferredAuthors: (state, action: PayloadAction<Suggestion[]>) => {
            state.preferredAuthors = action.payload;
            localStorage.setItem("preferences", JSON.stringify(state));
        },
    },
});

export const {
    setPreferredSources,
    setPreferredCategories,
    setPreferredAuthors,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;

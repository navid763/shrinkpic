import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ThemeState {
    mode: "dark" | "light"
}

const initstate: ThemeState = {
    mode: (typeof window !== "undefined" && localStorage.getItem("theme") as "light" | "dark") || "light"
};

export const themeSlice = createSlice({
    name: "theme",
    initialState: initstate,
    reducers: {
        setTheme: (state, action: PayloadAction<"light" | "dark">) => {
            state.mode = action.payload
            if (typeof window !== "undefined") {
                localStorage.setItem("theme", state.mode)
            }
        },
        toggleTheme: (state) => {
            state.mode = state.mode === "dark" ? "light" : "dark";
            if (typeof window !== "undefined") {
                localStorage.setItem("theme", state.mode)
            }
        }
    }
});

export const { setTheme, toggleTheme } = themeSlice.actions

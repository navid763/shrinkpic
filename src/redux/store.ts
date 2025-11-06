import { configureStore } from "@reduxjs/toolkit";
import { imageSlice } from "./slices/image-slice";
import { themeSlice } from "./slices/theme-slice";

export const store = configureStore({
    reducer: {
        images: imageSlice.reducer,
        theme: themeSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
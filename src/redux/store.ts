import { configureStore } from "@reduxjs/toolkit";
import { imageSlice } from "./slices/image-slice";

export const store = configureStore({
    reducer: {
        images: imageSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
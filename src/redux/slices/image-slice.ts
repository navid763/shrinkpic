import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface imageState {
    url: string;
    name: string;
    width: number | null;
    height: number | null;
    size: number | null;
}
const initstate: imageState[] = [];

export const imageSlice = createSlice({
    name: "images",
    initialState: initstate,

    reducers: {
        setImages: (state, action: PayloadAction<imageState[]>) => {
            // const { url, width, height, size } = action.payload;
            // state.push(...action.payload)
            return (action.payload)
        },
        emptyImages: () => []
    }
})

export const { setImages, emptyImages } = imageSlice.actions
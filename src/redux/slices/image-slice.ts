import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface imageState {
    url: string;
    width: number | null;
    height: number | null;
    size: number | null
}
const initstate: imageState = {
    url: "",
    width: null,
    height: null,
    size: null
}

export const imageSlice = createSlice({
    name: "image",
    initialState: initstate,

    reducers: {
        setImage: (state, action: PayloadAction<imageState>) => {
            const { url, width, height, size } = action.payload;
            state.url = url
            state.height = height
            state.width = width
            state.size = size
        },
        emptyImage: (state) => {
            state.url = "";
            state.width = null;
            state.height = null;
            state.size = null
        }
    }
})

export const { setImage, emptyImage } = imageSlice.actions
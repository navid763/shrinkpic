import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface imageState {
    url: string;
    width: number | null;
    height: number | null
}
const initstate: imageState = {
    url: "",
    width: null,
    height: null
}

export const imageSlice = createSlice({
    name: "image",
    initialState: initstate,

    reducers: {
        setImage: (state, action: PayloadAction<imageState>) => {
            const { url, width, height } = action.payload;
            state.url = url
            state.height = height
            state.width = width
        },
        emptyImage: (state) => {
            state.url = "";
            state.width = null;
            state.height = null;
        }
    }
})

export const { setImage, emptyImage } = imageSlice.actions
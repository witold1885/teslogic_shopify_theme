import { createSlice } from '@reduxjs/toolkit'

interface ContentState {
    main_menu?: MenuItem[]
    footer_menu?: MenuItem[]
    loading: boolean
    error?: string|null
}

const initialState: ContentState = {
    main_menu: [],
    footer_menu: [],
    loading: false,
    error: null
}

export const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {},
})

export default contentSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import type { Country, MenuItem } from '../../types/shopify'

interface ContentState {
    countries?: Country[]
    main_menu?: MenuItem[]
    footer_menu?: MenuItem[]
    loading: boolean
    error?: string|null
}

const initialState: ContentState = {
    countries: [],
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

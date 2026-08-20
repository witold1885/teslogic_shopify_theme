import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Country, MenuItem } from '../../types/shopify'

interface ContentState {
    country?: Country | null
    countries?: Country[]
    main_menu?: MenuItem[]
    footer_menu?: MenuItem[]
    loading: boolean
    error?: string|null
}

const initialState: ContentState = {
    country: null,
    countries: [],
    main_menu: [],
    footer_menu: [],
    loading: false,
    error: null
}

export const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {
        setCountry: (state, action: PayloadAction<Country>) => {
            state.country = action.payload
            localStorage.setItem('country', JSON.stringify(action.payload))
        },
    },
})

export const { setCountry } = contentSlice.actions
export default contentSlice.reducer

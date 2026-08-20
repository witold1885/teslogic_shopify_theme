import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Country, MenuItem } from '../../types/shopify'
import shopify from '../shopify'

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

export const setCountry = createAsyncThunk(
    'content/setCountry',
    async (country: Country, { rejectWithValue }) => {
        const formData = new URLSearchParams()

        formData.append('form_type', 'localization')
        formData.append('utf8', '✓')
        formData.append('_method', 'put')
        formData.append('country_code', country.iso_code)

        const result = await shopify.post('localization', formData, true)

        if (!result.success) {
            return rejectWithValue(result.message)
        }

        console.log({ ...result.data as any, country })

        return result.data
    }
)

export const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(setCountry.pending, (state) => {
                state.error = null
            })
            .addCase(setCountry.fulfilled, (state) => {

            })
            .addCase(setCountry.rejected, (state, action) => {
                state.error = action.payload as string
            })
    }
})

export default contentSlice.reducer

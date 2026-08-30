import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Country, MenuItem, Region, RegionsResponse } from '../../types/shopify'
import shopify from '../shopify'

interface ContentState {
    country?: Country | null
    regions: Region[]
    main_menu?: MenuItem[]
    footer_menu?: MenuItem[]
    loading: boolean
    error?: string|null
}

const initialState: ContentState = {
    country: null,
    regions: [],
    main_menu: [],
    footer_menu: [],
    loading: false,
    error: null
}

export const getRegions = createAsyncThunk(
    'content/getRegions',
    async (_, { rejectWithValue }) => {
        try {
            const { default: api } = await import('../api')
            const result = await api.get<RegionsResponse>('api/regions')
            
            if (!result.success) {
                return rejectWithValue(result.message)
            }
            
            return result.data.regions || []
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const setCountry = createAsyncThunk(
    'content/setCountry',
    async (country: Country, { rejectWithValue }) => {
        try {
            const formData = new URLSearchParams()

            formData.append('form_type', 'localization')
            formData.append('utf8', '✓')
            formData.append('_method', 'put')
            formData.append('country_code', country.iso_code)

            await shopify.post('localization', formData, true)

            return country
        } catch (err: any) {
            return rejectWithValue(err.message || 'Network error')
        }
    }
)

export const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRegions.pending, (state) => {
                state.error = null
            })
            .addCase(getRegions.fulfilled, (state, action: PayloadAction<Region[]>) => {
                state.regions = action.payload
            })
            .addCase(getRegions.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(setCountry.pending, (state) => {
                state.error = null
            })
            .addCase(setCountry.fulfilled, (state, action: PayloadAction<Country>) => {
                state.country = action.payload
            })
            .addCase(setCountry.rejected, (state, action) => {
                state.error = action.payload as string
            })
    }
})

export default contentSlice.reducer

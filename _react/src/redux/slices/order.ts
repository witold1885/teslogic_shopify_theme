import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { type RateResponse, type CartResponse, type CartPayload } from '../../types/product'

export interface OrderState {
    rate: number | null
    loading: boolean
    addedToCart?: boolean
    error?: string|null
}

export const initialState: OrderState = {
    rate: 1,
    loading: false,
    addedToCart: false,
    error: null
}

export const getRate = createAsyncThunk(
    'order/getRate',
    async (symbol: string, { rejectWithValue }) => {
        const { default: api } = await import('../api')
        const result = await api.get<RateResponse>(`api/rate/${symbol}`)
        
        if (!result.success) {
            return rejectWithValue(result.message)
        }
        
        return result.data
    }
)

export const addToCart = createAsyncThunk(
    'order/addToCart',
    async (data: CartPayload, { rejectWithValue }) => {
        const { default: shopify } = await import('../shopify')
        const result = await shopify.post<CartResponse>('cart/add.js', data)

        if (!result.success) {
            return rejectWithValue(result.message)
        }

        return result.data
    }
)

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRate.pending, (state) => {
                state.error = null
            })
            .addCase(getRate.fulfilled, (state, action) => {
                state.rate = action.payload.rate
            })
            .addCase(getRate.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true
                state.addedToCart = false
                state.error = null
            })
            .addCase(addToCart.fulfilled, (state) => {
                state.loading = false
                state.addedToCart = true
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false
                state.addedToCart = false
                state.error = action.payload as string
            })
    }
})

export default orderSlice

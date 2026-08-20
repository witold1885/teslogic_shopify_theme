import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { type Product, type RateResponse, type CartResponse, type CartPayload } from '../../types/product'
import shopify from '../shopify'

interface ProductsState {
    rate: number | null
    cartItemCount?: number
    products?: Product[]
    product?: Product | null
    additionalProducts?: Product[]
    loading: boolean
    addedToCart?: boolean
    error?: string|null
}

const initialState: ProductsState = {
    rate: 1,
    cartItemCount: 0,
    products: [],
    product: null,
    additionalProducts: [],
    loading: false,
    addedToCart: false,
    error: null
}

export const getRate = createAsyncThunk(
    'products/getRate',
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
    'products/addToCart',
    async (data: CartPayload, { rejectWithValue }) => {
        const result = await shopify.post<CartResponse>('cart/add.js', data)

        if (!result.success) {
            return rejectWithValue(result.message)
        }

        return result.data
    }
)

export const productsSlice = createSlice({
    name: 'products',
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

export default productsSlice.reducer

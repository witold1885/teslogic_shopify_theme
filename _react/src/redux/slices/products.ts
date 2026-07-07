import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProduct } from '../lib'
import type { CartResponse, CartPayload, Product } from '../../types/product'
import shopify from '../shopify'

interface ProductsState {
    cartItemCount?: number
    products?: Product[]
    product?: Product | null
    additionalProducts?: Product[]
    loading: boolean
    addedToCart?: boolean
    error?: string|null
}

const initialState: ProductsState = {
    cartItemCount: 0,
    products: [],
    product: null,
    additionalProducts: [],
    loading: false,
    addedToCart: false,
    error: null
}

export const fetchProduct = createAsyncThunk(
    'products/fetchProduct',
    async (slug: string) => {
        return getProduct(slug)
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
            .addCase(fetchProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.loading = false
                state.product = action.payload
            })
            .addCase(fetchProduct.rejected, (state, action) => {
                state.loading = false
                state.product = null
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

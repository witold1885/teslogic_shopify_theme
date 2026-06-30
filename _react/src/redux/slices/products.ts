import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProduct } from '../lib'
import type { Product } from '../../types/product'

interface ProductsState {
    products: Product[],
    product: Product | null
    loading: boolean
    error?: string|null
}

const initialState: ProductsState = {
    products: [],
    product: null,
    loading: false,
    error: null
}

export const fetchProduct = createAsyncThunk(
    'products/fetchProduct',
    async (slug: string) => {
        return getProduct(slug)
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
    }
})

export default productsSlice.reducer

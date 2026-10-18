import { createSlice } from '@reduxjs/toolkit'
import { type Product } from '../../types/product'

export interface ProductsState {
    cartItemCount?: number
    products?: Product[]
    product?: Product | null
    additionalProducts?: Product[]
    loading: boolean
    error?: string|null
}

export const initialState: ProductsState = {
    cartItemCount: 0,
    products: [],
    product: null,
    additionalProducts: [],
    loading: false,
    error: null
}

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {}
})

export default productsSlice.reducer

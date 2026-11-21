import { type Product } from '../../types/product'

export interface ProductsState {
    cartItemCount?: number
    products?: Product[]
    product?: Product | null
    additionalProducts?: Product[]
    bundleProducts?: Product[]
    loading: boolean
    error?: string|null
}

export const initialState: ProductsState = {
    cartItemCount: 0,
    products: [],
    product: null,
    additionalProducts: [],
    bundleProducts: [],
    loading: false,
    error: null
}

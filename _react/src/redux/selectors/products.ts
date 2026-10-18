import { createSelector } from '@reduxjs/toolkit'
import { initialState, type ProductsState } from '../states/products'

const selectState = (state: any) => state.products || initialState
const keys = Object.keys(initialState) as (keyof ProductsState)[]

export const fetchProducts = createSelector(
    [selectState],
    (products): ProductsState => {
        const acc = {} as Record<keyof ProductsState, any>
        keys.forEach((key) => acc[key] = products?.[key] ?? initialState[key])
        return acc as ProductsState
    }
)

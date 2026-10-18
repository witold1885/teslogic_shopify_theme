import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { initialState, type OrderState } from '../states/order'

const selectState = (state: RootState) => state.order || initialState
const keys = Object.keys(initialState) as (keyof OrderState)[]

export const fetchOrder = createSelector(
    [selectState],
    (order): OrderState => {
        const acc = {} as Record<keyof OrderState, any>
        keys.forEach((key) => acc[key] = order?.[key] ?? initialState[key])
        return acc as OrderState
    }
)

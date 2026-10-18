import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { initialState, type ReviewsState } from '../states/reviews'

const selectState = (state: RootState) => state.reviews || initialState
const keys = Object.keys(initialState) as (keyof ReviewsState)[]

export const selectReviews = createSelector(
    [selectState],
    (reviews): ReviewsState => {
        const acc = {} as Record<keyof ReviewsState, any>
        keys.forEach((key) => acc[key] = reviews?.[key] ?? initialState[key])
        return acc as ReviewsState
    }
)

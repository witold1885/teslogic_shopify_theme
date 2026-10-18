import { createSelector } from '@reduxjs/toolkit'
import { initialState, type ReviewsState } from '../states/reviews'

const selectState = (state: any) => state.reviews || initialState
const keys = Object.keys(initialState) as (keyof ReviewsState)[]

export const selectReviews = createSelector(
    [selectState],
    (reviews): ReviewsState => {
        const acc = {} as Record<keyof ReviewsState, any>
        keys.forEach((key) => acc[key] = reviews?.[key] ?? initialState[key])
        return acc as ReviewsState
    }
)

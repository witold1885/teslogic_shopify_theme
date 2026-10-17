import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { initialState, type ContentState } from '../slices/content'

const selectState = (state: RootState) => state.content || initialState
const keys = Object.keys(initialState) as (keyof ContentState)[]

export const fetchContent = createSelector(
    [selectState],
    (content): ContentState => {
        const acc = {} as Record<keyof ContentState, any>
        keys.forEach((key) => acc[key] = content?.[key] ?? initialState[key])
        return acc as ContentState
    }
)

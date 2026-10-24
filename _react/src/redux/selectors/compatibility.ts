import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { initialState, type CompatibilityState } from '../states/compatibility'

const selectState = (state: RootState) => state.compatibility || initialState
const keys = Object.keys(initialState) as (keyof CompatibilityState)[]

export const fetchCompatibility = createSelector(
    [selectState],
    (compatibility): CompatibilityState => {
        const acc = {} as Record<keyof CompatibilityState, any>
        keys.forEach((key) => acc[key] = compatibility?.[key] ?? initialState[key])
        return acc as CompatibilityState
    }
)

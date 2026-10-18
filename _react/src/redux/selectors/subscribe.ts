import { createSelector } from '@reduxjs/toolkit'
import { initialState, type SubscribeState } from '../states/subscribe'

const selectState = (state: any) => state.subscribe || initialState
const keys = Object.keys(initialState) as (keyof SubscribeState)[]

export const fetchSubscribe = createSelector(
    [selectState],
    (subscribe): SubscribeState => {
        const acc = {} as Record<keyof SubscribeState, any>
        keys.forEach((key) => acc[key] = subscribe?.[key] ?? initialState[key])
        return acc as SubscribeState
    }
)

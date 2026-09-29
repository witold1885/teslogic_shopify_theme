import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { CustomSubscribePayload, DiscountSubscribePayload, SubscribeResponse } from '../../types/subscribe'

interface SubscribeState {
    loading: boolean
    customSubscribed: boolean
    discountSubscribed: boolean
    error: string|null
    customSubscribeError: string|null
    discountSubscribeError: string|null
}

const initialState: SubscribeState = {
    loading: false,
    customSubscribed: false,
    discountSubscribed: false,
    error: null,
    customSubscribeError: null,
    discountSubscribeError: null
}

export const customSubscribe = createAsyncThunk(
    'subscribe/customSubscribe',
    async (data: CustomSubscribePayload, { rejectWithValue }) => {
        const { default: api } = await import('../api')
        const result = await api.post<SubscribeResponse>('mail/custom-subscribe', data)

        if (!result.success) {
            return rejectWithValue(result.message)
        }

        if (!result.data.success) {
            return rejectWithValue(result.data.message)
        }

        return result.data
    }
)

export const discountSubscribe = createAsyncThunk(
    'subscribe/discountSubscribe',
    async (data: DiscountSubscribePayload, { rejectWithValue }) => {
        const { default: api } = await import('../api')
        const result = await api.post<SubscribeResponse>('mail/discount-subscribe', data)

        if (!result.success) {
            return rejectWithValue(result.message)
        }

        if (!result.data.success) {
            return rejectWithValue(result.data.message)
        }

        return result.data
    }
)

export const subscribeSlice = createSlice({
    name: 'subscribe',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(customSubscribe.pending, (state) => {
                state.loading = true
                state.customSubscribed = false
                state.error = null
                state.customSubscribeError = null
            })
            .addCase(customSubscribe.fulfilled, (state) => {
                state.loading = false
                state.customSubscribed = true
            })
            .addCase(customSubscribe.rejected, (state, action) => {
                state.loading = false
                state.customSubscribed = false
                state.error = action.payload as string
                state.customSubscribeError = action.payload as string
            })
            .addCase(discountSubscribe.pending, (state) => {
                state.loading = true
                state.discountSubscribed = false
                state.error = null
                state.discountSubscribeError = null
            })
            .addCase(discountSubscribe.fulfilled, (state) => {
                state.loading = false
                state.discountSubscribed = true
            })
            .addCase(discountSubscribe.rejected, (state, action) => {
                state.loading = false
                state.discountSubscribed = false
                state.error = action.payload as string
                state.discountSubscribeError = action.payload as string
            })
    }
})

export default subscribeSlice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { CustomSubscribePayload, DiscountSubscribePayload, SubscribeResponse } from '../../types/subscribe'

interface SubscribeState {
    loading: boolean
    subscribed: boolean
    error: string|null
}

const initialState: SubscribeState = {
    loading: false,
    subscribed: false,
    error: null
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
                state.subscribed = false
                state.error = null
            })
            .addCase(customSubscribe.fulfilled, (state) => {
                state.loading = false
                state.subscribed = true
            })
            .addCase(customSubscribe.rejected, (state, action) => {
                state.loading = false
                state.subscribed = false
                state.error = action.payload as string
            })
            .addCase(discountSubscribe.pending, (state) => {
                state.loading = true
                state.subscribed = false
                state.error = null
            })
            .addCase(discountSubscribe.fulfilled, (state) => {
                state.loading = false
                state.subscribed = true
            })
            .addCase(discountSubscribe.rejected, (state, action) => {
                state.loading = false
                state.subscribed = false
                state.error = action.payload as string
            })
    }
})

export default subscribeSlice.reducer

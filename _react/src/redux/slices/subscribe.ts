import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { SubscribePayload, SubscribeResponse } from '../../types/subscribe'
import api from '../api'

interface SubscribeState {
    loading: boolean
    error: string|null
}

const initialState: SubscribeState = {
    loading: false,
    error: null
}

export const customSubscribe = createAsyncThunk(
    'subscribe/customSubscribe',
    async (data: SubscribePayload, { rejectWithValue }) => {
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

export const subscribeSlice = createSlice({
    name: 'subscribe',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(customSubscribe.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(customSubscribe.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(customSubscribe.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export default subscribeSlice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { CompatibilityPayload, CompatibilityResponse } from '../../types/compatibility'
import { initialState } from '../states/compatibility'

export const checkCompatibility = createAsyncThunk(
    'compatibility/checkCompatibility',
    async (data: CompatibilityPayload, { rejectWithValue }) => {
        const { default: api } = await import('../api')
        const result = await api.post<CompatibilityResponse>('mail/check-compatibility', data)

        if (!result.success) {
            return rejectWithValue(result.message)
        }

        if (!result.data.success) {
            return rejectWithValue(result.data.error)
        }

        return result.data
    }
)

export const compatibilitySlice = createSlice({
    name: 'compatibility',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkCompatibility.pending, (state) => {
                state.loading = true
                state.checkingCompleted = false
                state.proceed = null
                state.error = null
                state.checkingError = null
            })
            .addCase(checkCompatibility.fulfilled, (state, action) => {
                state.loading = false
                state.checkingCompleted = true
                state.proceed = action.payload.proceed
                state.checkingError = action.payload.error
            })
            .addCase(checkCompatibility.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export default compatibilitySlice

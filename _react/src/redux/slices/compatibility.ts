import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { CompatibilityPayload, CompatibilityResponse } from '../../types/compatibility'
import { initialState } from '../states/compatibility'

export const checkCompatibility = createAsyncThunk(
    'compatibility/checkCompatibility',
    async (data: CompatibilityPayload, { rejectWithValue }) => {
        const { default: api } = await import('../api')
        const result = await api.post<CompatibilityResponse>('/mail/check-compatibility', data)

        console.log({ result })

        if (!result.success) {
            return rejectWithValue(result.message)
        }

        if (!result.data.success) {
            return rejectWithValue(result.data.message)
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
                state.error = null
            })
            .addCase(checkCompatibility.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(checkCompatibility.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export default compatibilitySlice

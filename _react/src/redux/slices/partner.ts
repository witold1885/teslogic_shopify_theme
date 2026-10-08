import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PartnerPayload, PartnerResponse } from '../../types/partner'

interface PartnerState {
    loading: boolean
    partnerRequested: Boolean
    error: string|null
    partnerRequestError: string|null
}

const initialState: PartnerState = {
    loading: false,
    partnerRequested: false,
    error: null,
    partnerRequestError: null
}

export const partnerRequest = createAsyncThunk(
    'partner/partnerRequest',
    async (data: PartnerPayload, { rejectWithValue }) => {
        const { default: api } = await import('../api')
        const result = await api.post<PartnerResponse>('mail/partner-request', data)

        if (!result.success) {
            return rejectWithValue(result.message)
        }

        if (!result.data.success) {
            return rejectWithValue(result.data.message || 'Error')
        }

        return result.data
    }
)

export const partnerSlice = createSlice({
    name: 'partner',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(partnerRequest.pending, (state) => {
                state.loading = true
                state.partnerRequested = false
                state.error = null
                state.partnerRequestError = null
            })
            .addCase(partnerRequest.fulfilled, (state) => {
                state.loading = false
                state.partnerRequested = true
            })
            .addCase(partnerRequest.rejected, (state, action) => {
                state.loading = false
                state.partnerRequested = false
                state.error = action.payload as string
                state.partnerRequestError = action.payload as string
            })
    }
})

export default partnerSlice.reducer

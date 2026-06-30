import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { ReviewsResponse, ReviewPayload } from '../../types/review'
import api from '../api'

interface ReviewsState extends ReviewsResponse {
    loading: boolean
    error?: string|null
}

const initialState: ReviewsState = {
    reviews: [],
    totalCount: 0,
    avgRating: 0.00,
    loading: false,
    error: null
}

export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async (productId: number, { rejectWithValue }) => {
        const result = await api.get<ReviewsResponse>('get-reviews', { product_id: productId })
        
        if (!result.success) {
            return rejectWithValue(result.message)
        }
        
        return result.data
    }
)

export const sendReview = createAsyncThunk(
    'reviews/sendReview',
    async (data: ReviewPayload, { rejectWithValue }) => {
        const result = await api.post('send-review', data)

        if (!result.success) {
            return rejectWithValue(result.message)
        }

        return result.data
    }
)

export const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false
                state.reviews = action.payload.reviews
                state.totalCount = action.payload.totalCount
                state.avgRating = action.payload.avgRating
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false
                state.reviews = []
                state.totalCount = 0
                state.avgRating = 0
                state.error = action.payload as string
            })
            .addCase(sendReview.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(sendReview.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(sendReview.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export default reviewsSlice.reducer

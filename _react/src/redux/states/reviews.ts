import type { ReviewsResponse } from '../../types/review'

export interface ReviewsState extends ReviewsResponse {
    loading: boolean
    error?: string|null
}

export const initialState: ReviewsState = {
    reviews: [],
    totalCount: 0,
    avgRating: 0.00,
    loading: false,
    error: null
}

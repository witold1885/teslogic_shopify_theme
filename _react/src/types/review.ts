export interface Review {
    id: number
    source: string
    review_id: number
    product_id: number
    reviewer_name: string
    reviewer_email: string
    reviewer_phone: string | null
    title: string | null
    body: string
    rating: number
    created_datetime: string
    updated_datetime: string
    review_source: string
    curated: string
    published: boolean
    hidden: boolean
    verified: string
    created_at: string
    updated_at: string
}

export interface ReviewsResponse {
    reviews: Review[]
    totalCount: number
    avgRating: number
}

export type ReviewsPayload = {
    productId: number
    source?: string
}

export type ReviewPayload = {
    shop_url?: string
    id?: number
    rating: number
    name: string
    email: string
    body: string
}

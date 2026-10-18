export interface OrderState {
    rate: number | null
    loading: boolean
    addedToCart?: boolean
    error?: string|null
}

export const initialState: OrderState = {
    rate: 1,
    loading: false,
    addedToCart: false,
    error: null
}

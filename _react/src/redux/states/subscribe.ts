export interface SubscribeState {
    loading: boolean
    customSubscribed: boolean
    discountSubscribed: boolean
    error: string|null
    customSubscribeError: string|null
    discountSubscribeError: string|null
}

export const initialState: SubscribeState = {
    loading: false,
    customSubscribed: false,
    discountSubscribed: false,
    error: null,
    customSubscribeError: null,
    discountSubscribeError: null
}

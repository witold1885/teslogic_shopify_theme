export interface SubscribeState {
    loading: boolean
    customSubscribed: boolean
    discountSubscribed: boolean
    vipSubscribed: boolean
    error: string|null
    customSubscribeError: string|null
    discountSubscribeError: string|null
    vipSubscribeError: string|null
}

export const initialState: SubscribeState = {
    loading: false,
    customSubscribed: false,
    discountSubscribed: false,
    vipSubscribed: false,
    error: null,
    customSubscribeError: null,
    discountSubscribeError: null,
    vipSubscribeError: null
}

export type CustomSubscribePayload = {
    email: string
}

export type DiscountSubscribePayload = {
    name?: string
    email: string
    tesla_models?: string[]
}

export interface SubscribeResponse {
    success: boolean
    message?: string
}

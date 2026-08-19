export interface Model {
    id: number,
    title: string
    sku?: string
    price?: number
    oldPrice?: number
}

export interface Product {
    id: number
    title: string
    price?: number
    maxPrice?: number
    oldPrice?: number
    models?: Model[]
}

export interface RateResponse {
    success: boolean
    rate: number | null
    error?: string
}

export interface CartPayloadItem {
    id: number
    quantity?: number
}

export type CartPayload = {
    items: CartPayloadItem[]
}

export interface CartResponse {
    body: ReadableStream
    bodyUsed: boolean
    headers: Headers
    ok: boolean
    redirected: boolean
    status: number
    statusText: string
    type: string
    url: string
}

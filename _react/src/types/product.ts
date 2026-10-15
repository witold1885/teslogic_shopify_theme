export interface Model {
    id: number,
    title: string
    sku?: string
    price?: number
    oldPrice?: number
}

export interface ProductImage {
    main: string
    thumb: string
}

export interface Product {
    id: number
    title: string
    description?: string
    price?: number
    maxPrice?: number
    oldPrice?: number
    models?: Model[]
    images?: ProductImage[]
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

export interface Model {
    name: string
    price?: number
    oldPrice?: number
}

export interface Product {
    productId: number
    name: string
    price?: number
    oldPrice?: number
    models?: Model[]
}

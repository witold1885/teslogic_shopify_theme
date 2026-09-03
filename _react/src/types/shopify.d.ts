import type { ReactNode } from 'react'
import type { Product } from './product'

export interface Region {
    name: string
    subregions: Subregion[]
}

export interface Subregion {
    name: string
    countries: Country[]
}

export interface Country {
    name: string
    iso_code: string
    currency_code: string
    currency_symbol: string
    vat_percent?: number
    flag?: string
}

export interface RegionsResponse {
    success: boolean
    regions: Region[]
}

interface MenuItem {
    title: ReactNode
    url?: string
    children?: MenuItem[]
}

declare global {
    interface Window {
        ShopifyReactData?: {
            content: {
                country: Country
                main_menu: MenuItem[]
                footer_menu: MenuItem[]
            }
            cart: { item_count: number }
            product: Product
            additionalProducts: Product[]
        } | null
    }
}

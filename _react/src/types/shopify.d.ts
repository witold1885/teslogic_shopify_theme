import type { ReactNode } from 'react'
import type { Product } from './product'

export interface Country {
    name: string
    iso_code: string
    currency_code: string
    currency_symbol: string
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
                countries: Country[]
                main_menu: MenuItem[]
                footer_menu: MenuItem[]
            }
            cart: { item_count: number }
            product: Product
            additionalProducts: Product[]
        }
    }
}

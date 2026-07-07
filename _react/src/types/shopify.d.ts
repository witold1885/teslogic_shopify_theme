import type { ReactNode } from 'react'
import type { Product } from './product'

interface MenuItem {
    title: ReactNode
    url?: string
    children?: MenuItem[]
}

declare global {
    interface Window {
        ShopifyReactData?: {
            content: {
                main_menu: MenuItem[]
                footer_menu: MenuItem[]
            }
            cart: { item_count: number }
            product: Product
            additionalProducts: Product[]
        }
    }
}

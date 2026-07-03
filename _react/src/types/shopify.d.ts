import type { ReactNode } from 'react'

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
        }
    }
}

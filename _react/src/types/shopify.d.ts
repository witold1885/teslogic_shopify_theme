interface MenuItem {
    title: string
    url: string
    children?: MenuItem[]
}

interface Window {
    ShopifyReactData?: {
        content: {
            main_menu: MenuItem[]
            footer_menu: MenuItem[]
        }
    }
}

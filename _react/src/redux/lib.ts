import type { Product } from '../types/product'

export const products: Record<string, Product> = {
    'screenmate': {
        productId: 9016908742875,
        name: 'Screenmate ONE',
        price: 890,
        oldPrice: 1190,
        models: [
            { name: 'Model 3 ‘17-23' },
            { name: 'Model 3 ‘24+ (Highland)' },
            { name: 'Model Y ‘21-24' },
            { name: 'Model Y ‘25+ (Juniper)' },
            { name: 'Model S ‘21+' },
            { name: 'Model X ‘21+' },
        ]
    },
    'dash': { name: 'Screenmate Dash', productId: 9016908906715 },
    'pro': { name: 'Powermate', productId: 9016908808411 },
}

export const getProduct = (slug: string): Product => products[slug]

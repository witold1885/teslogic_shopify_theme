import {
    generatePreloadTags,
    generateLCPBanner,
    generateLCPProduct,
    generateSeoSnippet,
    saveSnippet,
    updateCssFile
} from './utils.js'

const pagesMap = {
    ScreenmateOne: { slug: 'screenmate-one' },
    ScreenmateDash: {
        slug: 'screenmate-dash',
        lcp: { desktop: 'screenmate_dash_banner_desktop', mobile: 'screenmate_dash_banner_mobile' },
        lcpType: 'banner'
    },
    Powermate: {
        slug: 'powermate',
        lcp: { desktop: 'powermate_banner_desktop', mobile: 'powermate_banner_mobile' },
        lcpType: 'banner'
    },
    Installers: { slug: 'installers', lcp: { desktop: 'installers_sketch' } },
    Partners: { slug: 'partners' },
    Product: {
        slug: 'product',
        lcp: { desktop: "{{ product.featured_image | img_url: '1052x1052' }}", mobile: "{{ product.featured_image | img_url: '172x172' }}" },
        lcpType: 'product'
    },
}

class Builder
{
    constructor (page) {
        this.page = page
        this.config = pagesMap[page] || { slug: page.toLowerCase() }
    }

    generateLCP () {
        const { slug, lcp, lcpType } = this.config

        if (lcp) {
            generatePreloadTags(`preload-${slug}`, lcp, lcpType)

            if (lcpType === 'banner') {
                const bannerLiquidContent = generateLCPBanner(this.page, slug, lcp.desktop, lcp.mobile)
                saveSnippet(`banner-${slug}`, bannerLiquidContent)
            }

            if (lcpType === 'product') {
                const productLiquidContent = generateLCPProduct(this.page, lcp.desktop, lcp.mobile)
                saveSnippet(`product-${slug}`, productLiquidContent)
            }
        }
    }

    generateSeo (fullHtml) {
        const seoSnippetContent = generateSeoSnippet(this.page, fullHtml)
        saveSnippet(`seo-${this.config.slug}`, seoSnippetContent)
    }

    updateLiquid () {
        updateCssFile(`react-style-${this.page}`, `${this.config.slug.replace('-', '_')}_react`)
    }
}

export default Builder

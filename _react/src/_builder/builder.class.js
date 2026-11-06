import {
    generatePreloadTags,
    generateLCPSnippet,
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
    Product: { slug: 'product' },
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
            generatePreloadTags(`preload-${slug}`, lcp)

            if (lcpType === 'banner') {
                const bannerLiquidContent = generateLCPSnippet(this.page, slug, lcp.desktop, lcp.mobile)            
                saveSnippet(`banner-${slug}`, bannerLiquidContent)
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

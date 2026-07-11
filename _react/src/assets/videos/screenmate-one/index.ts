const externalUrls: Record<string, string> = {
    bannerDesktop: 'https://cdn.shopify.com/videos/c/o/v/9c8771ce047449129ef44b7218b45a6c.mp4',
    bannerMobile: 'https://cdn.shopify.com/videos/c/o/v/92bf15fa787c4cad8a940410f0b9a47a.mp4',
    beyondBasicControls: 'https://cdn.shopify.com/videos/c/o/v/465ad860a52142bea95dd018fcd849bc.mp4',
    carPlayAndAndroidAuto: 'https://cdn.shopify.com/videos/c/o/v/9ee8b0da9dae433b88bf15ff0acf37ef.mp4',
    connectConsoles: 'https://cdn.shopify.com/videos/c/o/v/34d81e824c9d4c44a359f50f6693adfb.mp4',
    dualViewMode: 'https://cdn.shopify.com/videos/c/o/v/a42bc18d607946a786727618b42e2f50.mp4',
    gaming: 'https://cdn.shopify.com/videos/c/o/v/03a0d5e25007456eb0edc0538e086394.mp4',
    navigation: 'https://cdn.shopify.com/videos/c/o/v/ee90abc85f3f44e59830496b4c35e438.mp4',
    social: 'https://cdn.shopify.com/videos/c/o/v/35908affa6b84f92a6c07b2a31d71e96.mp4',
    streaming: 'https://cdn.shopify.com/videos/c/o/v/120c9e3fd20f49c38f2612e893cc0585.mp4',
}

const isProd: boolean = import.meta.env.PROD
const getDevUrl = (name: string) => new URL(`./${name}.mp4`, import.meta.url).href

export const bannerDesktop = isProd ? externalUrls.bannerDesktop : getDevUrl('banner-desktop')
export const bannerMobile = isProd ? externalUrls.bannerMobile : getDevUrl('banner-mobile')
export const beyondBasicControls = isProd ? externalUrls.beyondBasicControls : getDevUrl('beyond-basic-controls')
export const carPlayAndAndroidAuto = isProd ? externalUrls.carPlayAndAndroidAuto : getDevUrl('car-play-and-android-auto')
export const connectConsoles = isProd ? externalUrls.connectConsoles : getDevUrl('connect-consoles')
export const dualViewMode = isProd ? externalUrls.dualViewMode : getDevUrl('dual-view-mode')
export const gaming = isProd ? externalUrls.gaming : getDevUrl('gaming')
export const navigation = isProd ? externalUrls.navigation : getDevUrl('navigation')
export const social = isProd ? externalUrls.social : getDevUrl('social')
export const streaming = isProd ? externalUrls.streaming : getDevUrl('streaming')

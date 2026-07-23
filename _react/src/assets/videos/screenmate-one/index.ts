const externalUrls: Record<string, string> = {
    bannerDesktop: 'https://cdn.shopify.com/videos/c/o/v/1df357ba7898441ebb74c18c360f1867.mp4',
    bannerMobile: 'https://cdn.shopify.com/videos/c/o/v/8ece68fb283b4d4c83eea1fcc3d65ec1.mp4',
    beyondBasicControls: 'https://cdn.shopify.com/videos/c/o/v/465ad860a52142bea95dd018fcd849bc.mp4',
    carPlayAndAndroidAuto: 'https://cdn.shopify.com/videos/c/o/v/9ee8b0da9dae433b88bf15ff0acf37ef.mp4',
    connectConsoles: 'https://cdn.shopify.com/videos/c/o/v/34d81e824c9d4c44a359f50f6693adfb.mp4',
    dualViewMode: 'https://cdn.shopify.com/videos/c/o/v/a42bc18d607946a786727618b42e2f50.mp4',
    gamingDesktop: 'https://cdn.shopify.com/videos/c/o/v/c5ca80ab75a74c58b6effe22d99d461a.mp4',
    gamingMobile: 'https://cdn.shopify.com/videos/c/o/v/ee2f4bcce53a4a888f033c2f607377a0.mp4',
    navigationDesktop: 'https://cdn.shopify.com/videos/c/o/v/7f713217611b494dabd63f9c8a3d8eac.mp4',
    navigationMobile: 'https://cdn.shopify.com/videos/c/o/v/47ba5020c3454261a34371661175bff9.mp4',
    socialDesktop: 'https://cdn.shopify.com/videos/c/o/v/75239955719549bb99e73700f4acdf86.mp4',
    socialMobile: 'https://cdn.shopify.com/videos/c/o/v/8bde54067a384bbcbc54f277f2a9e3f4.mp4',
    streamingDesktop: 'https://cdn.shopify.com/videos/c/o/v/3a994b55a1b444f0ba3b96ee2d90dff7.mp4',
    streamingMobile: 'https://cdn.shopify.com/videos/c/o/v/3d0512c1e70140f89cf732cd46e4c3da.mp4',
}

const isProd: boolean = import.meta.env.PROD
const getDevUrl = (name: string) => new URL(`./${name}.mp4`, import.meta.url).href

export const bannerDesktop = isProd ? externalUrls.bannerDesktop : getDevUrl('banner-desktop')
export const bannerMobile = isProd ? externalUrls.bannerMobile : getDevUrl('banner-mobile')
export const beyondBasicControls = isProd ? externalUrls.beyondBasicControls : getDevUrl('beyond-basic-controls')
export const carPlayAndAndroidAuto = isProd ? externalUrls.carPlayAndAndroidAuto : getDevUrl('car-play-and-android-auto')
export const connectConsoles = isProd ? externalUrls.connectConsoles : getDevUrl('connect-consoles')
export const dualViewMode = isProd ? externalUrls.dualViewMode : getDevUrl('dual-view-mode')
export const gamingDesktop = isProd ? externalUrls.gamingDesktop : getDevUrl('gaming-desktop')
export const gamingMobile = isProd ? externalUrls.gamingMobile : getDevUrl('gaming-mobile')
export const navigationDesktop = isProd ? externalUrls.navigationDesktop : getDevUrl('navigation-desktop')
export const navigationMobile = isProd ? externalUrls.navigationMobile : getDevUrl('navigation-mobile')
export const socialDesktop = isProd ? externalUrls.socialDesktop : getDevUrl('social-desktop')
export const socialMobile = isProd ? externalUrls.socialMobile : getDevUrl('social-mobile')
export const streamingDesktop = isProd ? externalUrls.streamingDesktop : getDevUrl('streaming-desktop')
export const streamingMobile = isProd ? externalUrls.streamingMobile : getDevUrl('streaming-mobile')

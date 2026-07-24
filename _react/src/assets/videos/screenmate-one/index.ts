const externalUrls: Record<string, string> = {
    bannerDesktop: 'https://cdn.shopify.com/videos/c/o/v/e844591cfe6b4ff38cdba0979cbb5254.mp4',
    bannerMobile: 'https://cdn.shopify.com/videos/c/o/v/4e5a56ce184549368a5e391aaba75205.mp4',
    beyondBasicControlsDesktop: 'https://cdn.shopify.com/videos/c/o/v/8373787401d0407a8187fc788e973661.mp4',
    beyondBasicControlsMobile: 'https://cdn.shopify.com/videos/c/o/v/978aff40f5c645d599e36daabf76585a.mp4',
    carPlayAndAndroidAutoDesktop: 'https://cdn.shopify.com/videos/c/o/v/03a53abb1046411b9a1c1828765a94a1.mp4',
    carPlayAndAndroidAutoMobile: 'https://cdn.shopify.com/videos/c/o/v/91ae2ac7bec249ac8bbb1f1ac8aee96b.mp4',
    connectConsolesDesktop: 'https://cdn.shopify.com/videos/c/o/v/2fcc7c5f78a14caf938806bdce41972a.mp4',
    connectConsolesMobile: 'https://cdn.shopify.com/videos/c/o/v/cdbc8c6f1cca451fa6530ef3f3daa99a.mp4',
    dualViewModeDesktop: 'https://cdn.shopify.com/videos/c/o/v/8e794f7b730744ab85a72503ad8f869f.mp4',
    dualViewModeMobile: 'https://cdn.shopify.com/videos/c/o/v/a785ec13d29e48d9922e1b0a64c68df6.mp4',
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
export const beyondBasicControlsDesktop = isProd ? externalUrls.beyondBasicControlsDesktop : getDevUrl('beyond-basic-controls-desktop')
export const beyondBasicControlsMobile = isProd ? externalUrls.beyondBasicControlsMobile : getDevUrl('beyond-basic-controls-mobile')
export const carPlayAndAndroidAutoDesktop = isProd ? externalUrls.carPlayAndAndroidAutoDesktop : getDevUrl('car-play-and-android-auto-desktop')
export const carPlayAndAndroidAutoMobile = isProd ? externalUrls.carPlayAndAndroidAutoMobile : getDevUrl('car-play-and-android-auto-mobile')
export const connectConsolesDesktop = isProd ? externalUrls.connectConsolesDesktop : getDevUrl('connect-consoles-desktop')
export const connectConsolesMobile = isProd ? externalUrls.connectConsolesMobile : getDevUrl('connect-consoles-mobile')
export const dualViewModeDesktop = isProd ? externalUrls.dualViewModeDesktop : getDevUrl('dual-view-mode-desktop')
export const dualViewModeMobile = isProd ? externalUrls.dualViewModeMobile : getDevUrl('dual-view-mode-mobile')
export const gamingDesktop = isProd ? externalUrls.gamingDesktop : getDevUrl('gaming-desktop')
export const gamingMobile = isProd ? externalUrls.gamingMobile : getDevUrl('gaming-mobile')
export const navigationDesktop = isProd ? externalUrls.navigationDesktop : getDevUrl('navigation-desktop')
export const navigationMobile = isProd ? externalUrls.navigationMobile : getDevUrl('navigation-mobile')
export const socialDesktop = isProd ? externalUrls.socialDesktop : getDevUrl('social-desktop')
export const socialMobile = isProd ? externalUrls.socialMobile : getDevUrl('social-mobile')
export const streamingDesktop = isProd ? externalUrls.streamingDesktop : getDevUrl('streaming-desktop')
export const streamingMobile = isProd ? externalUrls.streamingMobile : getDevUrl('streaming-mobile')

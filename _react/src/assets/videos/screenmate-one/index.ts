const externalUrls: Record<string, string> = {
    bannerDesktop: 'https://cdn.shopify.com/videos/c/o/v/e41a762f70c045989e8e3b8a114058a7.mp4',
    beyondBasicControls: 'https://cdn.shopify.com/videos/c/o/v/abba7f7a20c14f008ef949bbfa313d7f.mp4',
    carPlayAndAndroidAuto: 'https://cdn.shopify.com/videos/c/o/v/78427390f7d44055b9436e760a222545.mp4',
    connectConsoles: 'https://cdn.shopify.com/videos/c/o/v/32805c45d2404c08b619e4a2d1d97629.mp4',
    dualViewMode: 'https://cdn.shopify.com/videos/c/o/v/4d115270240c4785a23ab9dc3ef26d8a.mp4',
    gaming: 'https://cdn.shopify.com/videos/c/o/v/d39835a4d40b49668f428b463362587c.mp4',
    navigation: 'https://cdn.shopify.com/videos/c/o/v/05f39950af5547b093ab2d995c754ac7.mp4',
    social: 'https://cdn.shopify.com/videos/c/o/v/03c0dfbba36543b19799ec6289123f29.mp4',
    streaming: 'https://cdn.shopify.com/videos/c/o/v/246dc0a4d9dc45839ff77cc3f0d67763.mp4',
}

const isProd: boolean = import.meta.env.PROD
const getDevUrl = (name: string) => new URL(`./${name}.mp4`, import.meta.url).href

export const bannerDesktop = isProd ? externalUrls.bannerDesktop : getDevUrl('banner-desktop')
export const beyondBasicControls = isProd ? externalUrls.beyondBasicControls : getDevUrl('beyond-basic-controls')
export const carPlayAndAndroidAuto = isProd ? externalUrls.carPlayAndAndroidAuto : getDevUrl('car-play-and-android-auto')
export const connectConsoles = isProd ? externalUrls.connectConsoles : getDevUrl('connect-consoles')
export const dualViewMode = isProd ? externalUrls.dualViewMode : getDevUrl('dual-view-mode')
export const gaming = isProd ? externalUrls.gaming : getDevUrl('gaming')
export const navigation = isProd ? externalUrls.navigation : getDevUrl('navigation')
export const social = isProd ? externalUrls.social : getDevUrl('social')
export const streaming = isProd ? externalUrls.streaming : getDevUrl('streaming')

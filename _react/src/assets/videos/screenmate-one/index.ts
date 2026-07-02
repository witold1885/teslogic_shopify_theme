const externalUrls: Record<string, string> = {
    bannerDesktop: 'https://cdn.shopify.com/videos/c/o/v/b4811410d37f47059d56d608e1f66d20.mp4',
    beyondBasicControls: 'https://cdn.shopify.com/videos/c/o/v/c6262283d8db4a719d02ebb8bfa231ed.mp4',
    carPlayAndAndroidAuto: 'https://cdn.shopify.com/videos/c/o/v/3c13d464625e4ac3a1e37fb87aacb8dc.mp4',
    connectConsoles: 'https://cdn.shopify.com/videos/c/o/v/6f8a3a49e9bd4308b428e9b906ef0aa2.mp4',
    dualViewMode: 'https://cdn.shopify.com/videos/c/o/v/161e918796f7495594e143a140398a50.mp4',
    gaming: 'https://cdn.shopify.com/videos/c/o/v/7d4d21e3be90472791cf64a9ccc1a075.mp4',
    navigation: 'https://cdn.shopify.com/videos/c/o/v/905e7e5d4eac4106ac554397ddc5f572.mp4',
    social: 'https://cdn.shopify.com/videos/c/o/v/10108c9aa67e45a59bccaf814920a41d.mp4',
    streaming: 'https://cdn.shopify.com/videos/c/o/v/3514ca64f7a84b37afc57b3a752b359d.mp4',
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

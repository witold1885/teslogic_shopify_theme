const getUrl = (name: string) => new URL(`./${name}.png`, import.meta.url).href

export const bannerDesktop = getUrl('banner-desktop')
export const bannerMobile = getUrl('banner-mobile')
export const beyondBasicControls = getUrl('beyond-basic-controls')
export const carPlayAndAndroidAuto = getUrl('car-play-and-android-auto')
export const connectConsoles = getUrl('connect-consoles')
export const dualViewMode = getUrl('dual-view-mode')
export const gaming = getUrl('gaming')
export const navigation = getUrl('navigation')
export const social = getUrl('social')
export const streaming = getUrl('streaming')

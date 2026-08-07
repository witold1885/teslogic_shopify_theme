const externalUrls: Record<string, string> = {
    // bannerDesktop: 'https://cdn.shopify.com/videos/c/o/v/e844591cfe6b4ff38cdba0979cbb5254.mp4',
    bannerDesktop: 'https://cdn.shopify.com/videos/c/o/v/335743c0569a4dad83c5bed8e5e3fa09.mp4',
    // bannerMobile: 'https://cdn.shopify.com/videos/c/o/v/4e5a56ce184549368a5e391aaba75205.mp4',
    bannerMobile: 'https://cdn.shopify.com/videos/c/o/v/cd44b72fea20410ba570e4b0225cd25c.mp4',

    // beyondBasicControlsDesktop: 'https://cdn.shopify.com/videos/c/o/v/8373787401d0407a8187fc788e973661.mp4',
    beyondBasicControlsDesktop: 'https://cdn.shopify.com/videos/c/o/v/c934fdc8378e47cdab8c16173de3b2dd.mp4',
    // beyondBasicControlsMobile: 'https://cdn.shopify.com/videos/c/o/v/978aff40f5c645d599e36daabf76585a.mp4',
    beyondBasicControlsMobile: 'https://cdn.shopify.com/videos/c/o/v/f93109fb48ba40738b6a55831f8f5823.mp4',

    // carPlayAndAndroidAutoDesktop: 'https://cdn.shopify.com/videos/c/o/v/03a53abb1046411b9a1c1828765a94a1.mp4',
    carPlayAndAndroidAutoDesktop: 'https://cdn.shopify.com/videos/c/o/v/ad373295e1414eb684d1887cd2d7b93a.mp4',
    // carPlayAndAndroidAutoMobile: 'https://cdn.shopify.com/videos/c/o/v/91ae2ac7bec249ac8bbb1f1ac8aee96b.mp4',
    carPlayAndAndroidAutoMobile: 'https://cdn.shopify.com/videos/c/o/v/00f9b703080a4b09b4cb9811ef82a69c.mp4',

    // connectConsolesDesktop: 'https://cdn.shopify.com/videos/c/o/v/2fcc7c5f78a14caf938806bdce41972a.mp4',
    connectConsolesDesktop: 'https://cdn.shopify.com/videos/c/o/v/5ce255ace5174691bec5915850a7f1a2.mp4',
    // connectConsolesMobile: 'https://cdn.shopify.com/videos/c/o/v/cdbc8c6f1cca451fa6530ef3f3daa99a.mp4',
    connectConsolesMobile: 'https://cdn.shopify.com/videos/c/o/v/71c241e2bb524527a61693a1bff8565e.mp4',

    // dualViewModeDesktop: 'https://cdn.shopify.com/videos/c/o/v/8e794f7b730744ab85a72503ad8f869f.mp4',
    dualViewModeDesktop: 'https://cdn.shopify.com/videos/c/o/v/b64205c13a1b4e46abf2d4c43ad94c40.mp4',
    // dualViewModeMobile: 'https://cdn.shopify.com/videos/c/o/v/a785ec13d29e48d9922e1b0a64c68df6.mp4',
    dualViewModeMobile: 'https://cdn.shopify.com/videos/c/o/v/8530d6846dc04f0b92017eca1df23804.mp4',

    // gamingDesktop: 'https://cdn.shopify.com/videos/c/o/v/c5ca80ab75a74c58b6effe22d99d461a.mp4',
    gamingDesktop: 'https://cdn.shopify.com/videos/c/o/v/5bddaed7556d49ccb34e095bc25f0ec8.mp4',
    // gamingMobile: 'https://cdn.shopify.com/videos/c/o/v/ee2f4bcce53a4a888f033c2f607377a0.mp4',
    gamingMobile: 'https://cdn.shopify.com/videos/c/o/v/8063b2dd13ae401a8dad3359d90a5cc3.mp4',

    // navigationDesktop: 'https://cdn.shopify.com/videos/c/o/v/7f713217611b494dabd63f9c8a3d8eac.mp4',
    navigationDesktop: 'https://cdn.shopify.com/videos/c/o/v/fbafc781db85480882c9b87b0012af41.mp4',
    // navigationMobile: 'https://cdn.shopify.com/videos/c/o/v/47ba5020c3454261a34371661175bff9.mp4',
    navigationMobile: 'https://cdn.shopify.com/videos/c/o/v/48be1bcb10ca42aa9fe9f8521c09f7a8.mp4',

    // socialDesktop: 'https://cdn.shopify.com/videos/c/o/v/75239955719549bb99e73700f4acdf86.mp4',
    socialDesktop: 'https://cdn.shopify.com/videos/c/o/v/84bd734ff2c64cefa6d60b8c10db2e5f.mp4',
    // socialMobile: 'https://cdn.shopify.com/videos/c/o/v/8bde54067a384bbcbc54f277f2a9e3f4.mp4',
    socialMobile: 'https://cdn.shopify.com/videos/c/o/v/14ae50ad3dce4c8f90816e37d6f5d744.mp4',

    // streamingDesktop: 'https://cdn.shopify.com/videos/c/o/v/3a994b55a1b444f0ba3b96ee2d90dff7.mp4',
    streamingDesktop: 'https://cdn.shopify.com/videos/c/o/v/b16bdf37aae44d94b0eaf956af127f51.mp4',
    // streamingMobile: 'https://cdn.shopify.com/videos/c/o/v/3d0512c1e70140f89cf732cd46e4c3da.mp4',
    streamingMobile: 'https://cdn.shopify.com/videos/c/o/v/81b90629e0e44a7c8ae1362d3ff4986c.mp4',
}

const isProd: boolean = import.meta.env.PROD
const getProdUrl = (name: string) => import(`./${name}.mp4`)
const getDevUrl = (name: string, dir?: string) => new URL(`./${dir ? `${dir}/` : ''}${name}.mp4`, import.meta.url).href

// export const bannerDesktop = isProd ? externalUrls.bannerDesktop : getDevUrl('banner-desktop')
export const bannerDesktop = isProd ? externalUrls.bannerDesktop : getDevUrl('web/banner-desktop-web')
// export const bannerMobile = isProd ? externalUrls.bannerMobile : getDevUrl('banner-mobile')
export const bannerMobile = isProd ? externalUrls.bannerMobile : getDevUrl('web/banner-mobile-web')

// export const beyondBasicControlsDesktop = isProd ? externalUrls.beyondBasicControlsDesktop : getDevUrl('beyond-basic-controls-desktop')
export const beyondBasicControlsDesktop = isProd ? externalUrls.beyondBasicControlsDesktop : getDevUrl('web/beyond-basic-controls-desktop-web')
// export const beyondBasicControlsMobile = isProd ? externalUrls.beyondBasicControlsMobile : getDevUrl('beyond-basic-controls-mobile')
export const beyondBasicControlsMobile = isProd ? externalUrls.beyondBasicControlsMobile : getDevUrl('web/beyond-basic-controls-mobile-web')

// export const carPlayAndAndroidAutoDesktop = isProd ? externalUrls.carPlayAndAndroidAutoDesktop : getDevUrl('car-play-and-android-auto-desktop')
export const carPlayAndAndroidAutoDesktop = isProd ? externalUrls.carPlayAndAndroidAutoDesktop : getDevUrl('web/car-play-and-android-auto-desktop-web')
// export const carPlayAndAndroidAutoMobile = isProd ? externalUrls.carPlayAndAndroidAutoMobile : getDevUrl('car-play-and-android-auto-mobile')
export const carPlayAndAndroidAutoMobile = isProd ? externalUrls.carPlayAndAndroidAutoMobile : getDevUrl('web/car-play-and-android-auto-mobile-web')

// export const connectConsolesDesktop = isProd ? externalUrls.connectConsolesDesktop : getDevUrl('connect-consoles-desktop')
export const connectConsolesDesktop = isProd ? externalUrls.connectConsolesDesktop : getDevUrl('web/connect-consoles-desktop-web')
// export const connectConsolesMobile = isProd ? externalUrls.connectConsolesMobile : getDevUrl('connect-consoles-mobile')
export const connectConsolesMobile = isProd ? externalUrls.connectConsolesMobile : getDevUrl('web/connect-consoles-mobile-web')

// export const dualViewModeDesktop = isProd ? externalUrls.dualViewModeDesktop : getDevUrl('dual-view-mode-desktop')
export const dualViewModeDesktop = isProd ? externalUrls.dualViewModeDesktop : getDevUrl('web/dual-view-mode-desktop-web')
// export const dualViewModeMobile = isProd ? externalUrls.dualViewModeMobile : getDevUrl('dual-view-mode-mobile')
export const dualViewModeMobile = isProd ? externalUrls.dualViewModeMobile : getDevUrl('web/dual-view-mode-mobile-web')

// export const gamingDesktop = isProd ? externalUrls.gamingDesktop : getDevUrl('gaming-desktop')
export const gamingDesktop = isProd ? externalUrls.gamingDesktop : getDevUrl('web/gaming-desktop-web')
// export const gamingMobile = isProd ? externalUrls.gamingMobile : getDevUrl('gaming-mobile')
export const gamingMobile = isProd ? externalUrls.gamingMobile : getDevUrl('web/gaming-mobile-web')

// export const navigationDesktop = isProd ? externalUrls.navigationDesktop : getDevUrl('navigation-desktop')
export const navigationDesktop = isProd ? externalUrls.navigationDesktop : getDevUrl('web/navigation-desktop-web')
// export const navigationMobile = isProd ? externalUrls.navigationMobile : getDevUrl('navigation-mobile')
export const navigationMobile = isProd ? externalUrls.navigationMobile : getDevUrl('web/navigation-mobile-web')

// export const socialDesktop = isProd ? externalUrls.socialDesktop : getDevUrl('social-desktop')
export const socialDesktop = isProd ? externalUrls.socialDesktop : getDevUrl('web/social-desktop-web')
// export const socialMobile = isProd ? externalUrls.socialMobile : getDevUrl('social-mobile')
export const socialMobile = isProd ? externalUrls.socialMobile : getDevUrl('web/social-mobile-web')

// export const streamingDesktop = isProd ? externalUrls.streamingDesktop : getDevUrl('streaming-desktop')
export const streamingDesktop = isProd ? externalUrls.streamingDesktop : getDevUrl('web/streaming-desktop-web')
// export const streamingMobile = isProd ? externalUrls.streamingMobile : getDevUrl('streaming-mobile')
export const streamingMobile = isProd ? externalUrls.streamingMobile : getDevUrl('web/streaming-mobile-web')


// export const bannerDesktop = getProdUrl('banner-desktop-web')
// export const bannerMobile = getProdUrl('banner-mobile-web')

// export const beyondBasicControlsDesktop = getProdUrl('beyond-basic-controls-desktop-web')
// export const beyondBasicControlsMobile = getProdUrl('beyond-basic-controls-mobile-web')

// export const carPlayAndAndroidAutoDesktop = getProdUrl('car-play-and-android-auto-desktop-web')
// export const carPlayAndAndroidAutoMobile = getProdUrl('car-play-and-android-auto-mobile-web')

// export const connectConsolesDesktop = getProdUrl('connect-consoles-desktop-web')
// export const connectConsolesMobile = getProdUrl('connect-consoles-mobile-web')

// export const dualViewModeDesktop = getProdUrl('dual-view-mode-desktop-web')
// export const dualViewModeMobile = getProdUrl('dual-view-mode-mobile-web')

// export const gamingDesktop = getProdUrl('gaming-desktop-web')
// export const gamingMobile = getProdUrl('gaming-mobile-web')

// export const navigationDesktop = getProdUrl('navigation-desktop-web')
// export const navigationMobile = getProdUrl('navigation-mobile-web')

// export const socialDesktop = getProdUrl('social-desktop-web')
// export const socialMobile = getProdUrl('social-mobile-web')

// export const streamingDesktop = getProdUrl('streaming-desktop-web')
// export const streamingMobile = getProdUrl('streaming-mobile-web')

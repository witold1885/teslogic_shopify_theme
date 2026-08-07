const externalUrls: Record<string, string> = {
    // bannerDesktop: 'https://cdn.shopify.com/videos/c/o/v/e844591cfe6b4ff38cdba0979cbb5254.mp4',
    bannerDesktop: 'https://cdn.shopify.com/videos/c/o/v/b866bbcdcbc44961ac4991f384fbac72.mp4',
    // bannerMobile: 'https://cdn.shopify.com/videos/c/o/v/4e5a56ce184549368a5e391aaba75205.mp4',
    bannerMobile: 'https://cdn.shopify.com/videos/c/o/v/ef2bb101f4de433cbed447d8919e7aa8.mp4',

    // beyondBasicControlsDesktop: 'https://cdn.shopify.com/videos/c/o/v/8373787401d0407a8187fc788e973661.mp4',
    beyondBasicControlsDesktop: 'https://cdn.shopify.com/videos/c/o/v/01b2a410dbfd4563be56d0e4b2dd1cbe.mp4',
    // beyondBasicControlsMobile: 'https://cdn.shopify.com/videos/c/o/v/978aff40f5c645d599e36daabf76585a.mp4',
    beyondBasicControlsMobile: 'https://cdn.shopify.com/videos/c/o/v/2762fe054ef04bcab8f0b41cb867b266.mp4',

    // carPlayAndAndroidAutoDesktop: 'https://cdn.shopify.com/videos/c/o/v/03a53abb1046411b9a1c1828765a94a1.mp4',
    carPlayAndAndroidAutoDesktop: 'https://cdn.shopify.com/videos/c/o/v/b3b4f042f8054ff3b9fe4d13ac778ad0.mp4',
    // carPlayAndAndroidAutoMobile: 'https://cdn.shopify.com/videos/c/o/v/91ae2ac7bec249ac8bbb1f1ac8aee96b.mp4',
    carPlayAndAndroidAutoMobile: 'https://cdn.shopify.com/videos/c/o/v/a55ae704f44249b0be0c059bb314fdd6.mp4',

    // connectConsolesDesktop: 'https://cdn.shopify.com/videos/c/o/v/2fcc7c5f78a14caf938806bdce41972a.mp4',
    connectConsolesDesktop: 'https://cdn.shopify.com/videos/c/o/v/d8f124219f0241e08350f845bbeaa66a.mp4',
    // connectConsolesMobile: 'https://cdn.shopify.com/videos/c/o/v/cdbc8c6f1cca451fa6530ef3f3daa99a.mp4',
    connectConsolesMobile: 'https://cdn.shopify.com/videos/c/o/v/433a6d29ac10494e9bdd7d53c089bf31.mp4',

    // dualViewModeDesktop: 'https://cdn.shopify.com/videos/c/o/v/8e794f7b730744ab85a72503ad8f869f.mp4',
    dualViewModeDesktop: 'https://cdn.shopify.com/videos/c/o/v/b16923b6dbb044abbd3851178639f53f.mp4',
    // dualViewModeMobile: 'https://cdn.shopify.com/videos/c/o/v/a785ec13d29e48d9922e1b0a64c68df6.mp4',
    dualViewModeMobile: 'https://cdn.shopify.com/videos/c/o/v/ec9fbc82e31a4c45ad19cc5e0261cdc0.mp4',

    // gamingDesktop: 'https://cdn.shopify.com/videos/c/o/v/c5ca80ab75a74c58b6effe22d99d461a.mp4',
    gamingDesktop: 'https://cdn.shopify.com/videos/c/o/v/21cba75f3cf74e22a7247a6f8f529cbe.mp4',
    // gamingMobile: 'https://cdn.shopify.com/videos/c/o/v/ee2f4bcce53a4a888f033c2f607377a0.mp4',
    gamingMobile: 'https://cdn.shopify.com/videos/c/o/v/92b81f82ac05423596f65e34d60f8e76.mp4',

    // navigationDesktop: 'https://cdn.shopify.com/videos/c/o/v/7f713217611b494dabd63f9c8a3d8eac.mp4',
    navigationDesktop: 'https://cdn.shopify.com/videos/c/o/v/a3b0f588b2064c3196e695a0a8f0a63b.mp4',
    // navigationMobile: 'https://cdn.shopify.com/videos/c/o/v/47ba5020c3454261a34371661175bff9.mp4',
    navigationMobile: 'https://cdn.shopify.com/videos/c/o/v/4bc2ac99685f4f64aca90114675b83fd.mp4',

    // socialDesktop: 'https://cdn.shopify.com/videos/c/o/v/75239955719549bb99e73700f4acdf86.mp4',
    socialDesktop: 'https://cdn.shopify.com/videos/c/o/v/78d952ebf4cf4b1bac66833d3190c33d.mp4',
    // socialMobile: 'https://cdn.shopify.com/videos/c/o/v/8bde54067a384bbcbc54f277f2a9e3f4.mp4',
    socialMobile: 'https://cdn.shopify.com/videos/c/o/v/cbe5fa75bf3e41868b51c23e8358e741.mp4',

    // streamingDesktop: 'https://cdn.shopify.com/videos/c/o/v/3a994b55a1b444f0ba3b96ee2d90dff7.mp4',
    streamingDesktop: 'https://cdn.shopify.com/videos/c/o/v/e3a4e360b60a4b598e9ef3df9407d04b.mp4',
    // streamingMobile: 'https://cdn.shopify.com/videos/c/o/v/3d0512c1e70140f89cf732cd46e4c3da.mp4',
    streamingMobile: 'https://cdn.shopify.com/videos/c/o/v/4054fbd514e843a19bf6defecfa24f8f.mp4',
}

const isProd: boolean = import.meta.env.PROD
const getDevUrl = (name: string, dir?: string) => new URL(`./${dir ? `${dir}/` : ''}${name}.mp4`, import.meta.url).href
/*
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
*/

export const bannerDesktop = getDevUrl('web/banner-desktop-web')
export const bannerMobile = getDevUrl('web/banner-mobile-web')

export const beyondBasicControlsDesktop = getDevUrl('web/beyond-basic-controls-desktop-web')
export const beyondBasicControlsMobile = getDevUrl('web/beyond-basic-controls-mobile-web')

export const carPlayAndAndroidAutoDesktop = getDevUrl('web/car-play-and-android-auto-desktop-web')
export const carPlayAndAndroidAutoMobile = getDevUrl('web/car-play-and-android-auto-mobile-web')

export const connectConsolesDesktop = getDevUrl('web/connect-consoles-desktop-web')
export const connectConsolesMobile = getDevUrl('web/connect-consoles-mobile-web')

export const dualViewModeDesktop = getDevUrl('web/dual-view-mode-desktop-web')
export const dualViewModeMobile = getDevUrl('web/dual-view-mode-mobile-web')

export const gamingDesktop = getDevUrl('web/gaming-desktop-web')
export const gamingMobile = getDevUrl('web/gaming-mobile-web')

export const navigationDesktop = getDevUrl('web/navigation-desktop-web')
export const navigationMobile = getDevUrl('web/navigation-mobile-web')

export const socialDesktop = getDevUrl('web/social-desktop-web')
export const socialMobile = getDevUrl('web/social-mobile-web')

export const streamingDesktop = getDevUrl('web/streaming-desktop-web')
export const streamingMobile = getDevUrl('web/streaming-mobile-web')

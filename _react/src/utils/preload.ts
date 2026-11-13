import type { PreloadImage } from '../pages/types'
import { mediaDesktop, mediaMobile } from '../hooks/inline-styles.ts'

export const getPreloadImages = (...lists: Record<string, any>[]): PreloadImage[] => {
    let preloadImages: PreloadImage[] = []
    for (const list of lists) {
        preloadImages = preloadImages.concat(
            Object.entries(list)
                  .filter(([key, _]) => (key.includes('desktop') || key.includes('mobile')) && !key.includes('retina'))
                  .map(([key, image]) => ({ image, fetchPriority: 'low', media: key.includes('desktop') ? mediaDesktop : mediaMobile }))
        )
    }
    return preloadImages
}

import type { Country, MenuItem, Blog, Region, Video, VideoItem } from '../../types/shopify'

export interface ContentState {
    country?: Country | null
    regions?: Region[]
    main_menu?: MenuItem[]
    footer_menu?: MenuItem[]
    features?: Record<string, Blog>
    videos?: Video[]
    videoItems?: VideoItem[]
    loading: boolean
    error?: string|null
}

export const initialState: ContentState = {
    country: null,
    regions: [],
    main_menu: [],
    footer_menu: [],
    features: {},
    videos: [],
    videoItems: [],
    loading: false,
    error: null
}

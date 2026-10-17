import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Country, MenuItem, Blog, Region, RegionsResponse, Video, VideoItem } from '../../types/shopify'
import { parseChannelSnippet, parseVideoInfos } from '../yt'

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

export const getRegions = createAsyncThunk(
    'content/getRegions',
    async (_, { rejectWithValue }) => {
        try {
            const { default: api } = await import('../api')
            const result = await api.get<RegionsResponse>('api/regions')
            
            if (!result.success) {
                return rejectWithValue(result.message)
            }
            
            return result.data.regions || []
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const setCountry = createAsyncThunk(
    'content/setCountry',
    async (country: Country, { rejectWithValue }) => {
        try {
            const { default: shopify } = await import('../shopify')

            const formData = new URLSearchParams()

            formData.append('form_type', 'localization')
            formData.append('utf8', '✓')
            formData.append('_method', 'put')
            formData.append('country_code', country.iso_code)

            await shopify.post('localization', formData, true)

            return country
        } catch (err: any) {
            return rejectWithValue(err.message || 'Network error')
        }
    }
)

export const parseYoutubeVideos = createAsyncThunk(
    'content/parseYoutubeVideos',
    async (data: Video[], { rejectWithValue }) => {
        try {
            const result = []

            const { infos, stored } = await parseVideoInfos(data)

            const videoInfoArray = []

            for (const videoInfo of infos) {
                const { id, snippet } = videoInfo
                const videoDataItem = data.find(item => item.id == id)
                if (videoDataItem) {
                    const { url, html } = videoDataItem
                    const channelSnippet = videoInfo.channelSnippet || await parseChannelSnippet(snippet.channelId)
                    videoInfoArray.push({ id, snippet, channelSnippet })
                    result.push({ id, url, snippet, channelSnippet, html })
                }
            }

            if (!stored && videoInfoArray.length !== 0) {
                localStorage?.setItem('videoInfos', JSON.stringify(videoInfoArray))
            }

            return result
        } catch (err: any) {
            return rejectWithValue('Network error')
        }
    }
)

export const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRegions.pending, (state) => {
                state.error = null
            })
            .addCase(getRegions.fulfilled, (state, action: PayloadAction<Region[]>) => {
                state.regions = action.payload
            })
            .addCase(getRegions.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(setCountry.pending, (state) => {
                state.error = null
            })
            .addCase(setCountry.fulfilled, (state, action: PayloadAction<Country>) => {
                state.country = action.payload
            })
            .addCase(setCountry.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(parseYoutubeVideos.pending, (state) => {
                state.error = null
            })
            .addCase(parseYoutubeVideos.fulfilled, (state, action: PayloadAction<VideoItem[]>) => {
                state.videoItems = action.payload
            })
            .addCase(parseYoutubeVideos.rejected, (state, action) => {
                state.error = action.payload as string
            })
    }
})

export default contentSlice.reducer

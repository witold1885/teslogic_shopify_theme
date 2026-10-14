import type { Video } from "../types/shopify"

const YT_API_ENDPOINT = import.meta.env.VITE_YT_API_ENDPOINT
const YT_API_KEY = import.meta.env.VITE_YT_API_KEY

export const getVideoId = (url: string) => {
    let match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
}

export const getVideoInfos = async (videoIds: string[]) => {
    let response = await fetch(`${YT_API_ENDPOINT}videos?key=${YT_API_KEY}&id=${videoIds.join(',')}&part=snippet,contentDetails`)
    let data = await response.json()
    return data
}

export const getChannelInfo = async (channelId: string) => {
    let response = await fetch(`${YT_API_ENDPOINT}channels?key=${YT_API_KEY}&id=${channelId}&part=snippet`)
    let data = await response.json()
    return data
}

export const parseVideoInfos = async (data: Video[]) => {
    const storedVideoInfos = JSON.parse(localStorage?.getItem('videoInfos') || '[]') || []
    if (storedVideoInfos.length === data.length) return { infos: storedVideoInfos, stored: true }
    const videoInfos = await getVideoInfos(data.map(({ id }) => id).filter(Boolean) as string[])
    return { infos: videoInfos?.items || [], stored: false }
}

export const parseChannelSnippet = async (channelId: string) => {
    const channelInfo = await getChannelInfo(channelId)
    return channelInfo.items[0].snippet
}

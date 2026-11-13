export interface PreloadContent {
    fetchPriority?: "high" | "low" | "auto"
    media?: string
}

export interface PreloadImage extends PreloadContent {
    image: string
}

export interface PreloadVideo extends PreloadContent {
    video: string
}

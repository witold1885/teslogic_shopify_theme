declare module 'macy' {
    interface MacyOptions {
        container: HTMLElement | null
        columns?: number
        margin?: number | { x: number; y: number }
        trueOrder?: boolean
        waitForImages?: boolean
        useOwnImageLoader?: boolean
        mobileFirst?: boolean
        breakAt?: {
            [key: number]: number | { columns: number; margin?: number | { x: number; y: number } }
        }
    }

    export interface MacyInstance {
        recalculate: (refresh?: boolean, macyOptions?: boolean) => void
        runOnImageLoad: (callback: () => void, always?: boolean) => void
        remove: () => void
    }

    function macy(options: MacyOptions): MacyInstance
    export default macy
}

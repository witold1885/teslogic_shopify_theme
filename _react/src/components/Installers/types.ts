import type { ReactNode } from 'react'

export interface Installer {
    name: string
    logo?: { src: string; width: number; height: number }
    phone: string
    website?: string
    address: ReactNode
    coordinates: number[]
    tab: string
}

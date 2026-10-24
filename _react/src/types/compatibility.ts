export type CompatibilityPayload = {
    vin: string
    email: string
}

export interface CompatibilityResponse {
    success: boolean
    proceed?: boolean
    error?: string
}

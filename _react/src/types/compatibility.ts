export type CompatibilityPayload = {
    vin: string
    email: string
}

export interface CompatibilityResponse {
    success: boolean
    message?: string
}

export type PartnerPayload = {
    name: string
    location: string
    primary_contact: string
    secondary_contact: string
}

export interface PartnerResponse {
    success: boolean
    message?: string
}

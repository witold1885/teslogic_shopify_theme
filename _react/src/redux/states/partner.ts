export interface PartnerState {
    loading: boolean
    partnerRequested: Boolean
    error: string|null
    partnerRequestError: string|null
}

export const initialState: PartnerState = {
    loading: false,
    partnerRequested: false,
    error: null,
    partnerRequestError: null
}

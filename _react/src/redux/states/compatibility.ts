export interface CompatibilityState {
    loading: boolean
    error: string|null
}

export const initialState: CompatibilityState = {
    loading: false,
    error: null
}

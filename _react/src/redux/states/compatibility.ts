export interface CompatibilityState {
    loading: boolean
    checkingCompleted: boolean
    proceed?: boolean|null
    error: string|null
    checkingError?: string|null
}

export const initialState: CompatibilityState = {
    loading: false,
    checkingCompleted: false,
    proceed: null,
    error: null,
    checkingError: null
}

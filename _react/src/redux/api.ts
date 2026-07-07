const baseUrl: string = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export type Payload = Record<string, string | number | boolean | any[] | undefined | null> | null
type HeaderParams = Record<string, string> | null

export type ApiResponse<T> = 
    | { success: true; data: T }
    | { success: false; error: string; message: string }

class Api
{
    private baseUrl: string

    constructor (baseUrl: string) {
        this.baseUrl = baseUrl
    }

    getUrl (endpoint: string, params: Payload = null): string {
        let url = `${this.baseUrl}/${endpoint}`
        if (params) {
            url += '?' + Object.entries(params)
                               .filter(([_, v]) => !!v)
                               .map(([k, v]) => `${k}=${v}`)
                               .join('&')
        }
        return url.toString()
    }

    getHeaders (headerParams: HeaderParams = null): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        }

        if (headerParams) {
            Object.assign(headers, headerParams)
        }
        
        return headers
    }

    async get<T>(endpoint: string, params: Payload = null, headerParams: HeaderParams = null): Promise<ApiResponse<T>> {
        try {
            const response: Response = await fetch(this.getUrl(endpoint, params), {
                headers: this.getHeaders(headerParams)
            })

            return this.handleResponse<T>(endpoint, response)
        } catch (e: any) {
            return this.handleError<T>(e)
        }
    }

    async post<T>(endpoint: string, payload: Payload = {}, headerParams: HeaderParams = null): Promise<ApiResponse<T>> {
        try {
            const response: Response = await fetch(this.getUrl(endpoint), {
                method: 'POST',
                headers: this.getHeaders(headerParams),
                body: JSON.stringify(payload)
            })

            return this.handleResponse<T>(endpoint, response)
        } catch (e: any) {
            return this.handleError<T>(e)
        }
    }

    async handleResponse<T>(endpoint: string, response: Response): Promise<ApiResponse<T>> {
        if (response.ok) {
            const data = await response.json()
            return { success: true, data }
        }
        return this.handleError<T>(`[api][${endpoint}]: Error fetching data`)
    }

    handleError<T>(error: any): ApiResponse<T> {
        return {
            success: false,
            error: 'Server error',
            message: error.toString()
        }
    }
}

const api = new Api(baseUrl)
export default api

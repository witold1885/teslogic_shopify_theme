const baseUrl: string = import.meta.env.VITE_SHOPIFY_URL || 'http://localhost:5173'

export type Payload = Record<string, string | number | boolean | any[] | undefined | null> | null

export type ShopifyResponse<T> = 
    | { success: true; data: T }
    | { success: false; error: string; message: string }

class Shopify
{
    private baseUrl: string

    constructor (baseUrl: string) {
        this.baseUrl = baseUrl
    }
    
    async get<T>(endpoint: string): Promise<ShopifyResponse<T>> {
        try {
            const response: Response = await fetch(`${this.baseUrl}/${endpoint}`)

            return this.handleResponse<T>(endpoint, response)
        } catch (e: any) {
            return this.handleError<T>(e)
        }
    }

    async post<T>(endpoint: string, payload: Payload = {}): Promise<ShopifyResponse<T>> {
        try {
            const response: Response = await fetch(`${this.baseUrl}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            return this.handleResponse<T>(endpoint, response)
        } catch (e: any) {
            return this.handleError<T>(e)
        }
    }
    
    async handleResponse<T>(endpoint: string, response: Response): Promise<ShopifyResponse<T>> {
        if (response.ok) {
            const data = await response.json()
            return { success: true, data }
        }
        return this.handleError<T>(`[shopify][${this.baseUrl}/${endpoint}]: Error fetching data`)
    }

    handleError<T>(error: any): ShopifyResponse<T> {
        return {
            success: false,
            error: 'Server error',
            message: error.toString()
        }
    }


}

const shopify = new Shopify(baseUrl)
export default shopify

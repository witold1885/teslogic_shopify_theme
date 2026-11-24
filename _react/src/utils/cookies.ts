import Cookies from 'js-cookie'

export const setSubscriptionCookie = (key: string, value: number): void => {
    Cookies.set(key, value.toString(), { expires: 365, path: '/' })
}

export const setDiscountCookies = (discountCode: string): void => {
    Cookies.set('discount_code', discountCode.toString(), { path: '/' })
}

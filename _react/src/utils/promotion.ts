const promotionDates: Record<string, string[]> = {
    bf26vip: ['2026-11-26', '2026-11-26'],
    bf26: ['2026-11-27', '2026-11-29']
}

export const getCurrentPromotion = (): string | null => {
    const urlSearchParams: URLSearchParams | null = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const promotion = urlSearchParams?.get('promotion') || null

    if (promotion) {
        return promotion
    } else {
        const now = new Date().getTime()
        
        for (const [key, [startDate, endDate]] of Object.entries(promotionDates)) {
            const start = new Date(startDate)
            start.setHours(0, 0, 0, 0)
            const end = new Date(endDate)
            end.setHours(23, 59, 59, 999)
            if (now >= start.getTime() && now <= end.getTime()) {
                return key
            }
        }
    }

    return promotion || null
}

export const scrollToElement = (elementId: string, offset: number = 0) => {
    const target = document.getElementById(elementId)

    if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        })
        return true
    }
    return false
}

export const scrollToElementLazy = (elementId: string, onMountTrigger?: () => void, offset: number = 0) => {
    if (scrollToElement(elementId, offset)) return

    let attempts = 0
    const maxAttempts = 30

    const interval = setInterval(() => {
        attempts++
        const success = scrollToElement(elementId, offset)
        
        if (success || attempts >= maxAttempts) {
            clearInterval(interval)

            if (onMountTrigger) {
                onMountTrigger()
            }
        }
    }, 100)
}

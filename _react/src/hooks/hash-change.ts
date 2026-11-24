import { useEffect } from 'react'

export const useHashChange = (hash: string, callback: () => void) => {
    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash.slice(1) === hash) callback()
        }

        handleHashChange()

        window.addEventListener('hashchange', handleHashChange)

        return () => {
            window.removeEventListener('hashchange', handleHashChange)
        }
    }, [hash, callback])
}

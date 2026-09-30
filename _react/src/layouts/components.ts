import { lazy } from 'react'

const ssrComponents = import.meta.env.SSR
  ? import.meta.glob<any>('../components/**/*.tsx', { eager: true })
  : {}

const clientComponents = !import.meta.env.SSR
  ? import.meta.glob<any>('../components/**/*.tsx')
  : {}

export const getComponent = (relativePath: string) => {
  if (import.meta.env.SSR) {
    const mod = ssrComponents[relativePath]
    return mod?.default || mod
  }

  return lazy(clientComponents[relativePath] as () => Promise<any>)
}

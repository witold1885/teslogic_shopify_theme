import { createElement, lazy, type ComponentType } from 'react'

export function getComponent<T extends ComponentType<any> = ComponentType<any>>(
  clientImport: () => Promise<{ default: T } | any>,
  clientOnly: boolean = false
): T {
  if (import.meta.env.SSR) {
    if (clientOnly) return null as unknown as T

    let mod: any = null

    clientImport().then(m => {
      mod = m.default || m
    })

    return ((props: any) => {
      return mod ? createElement(mod, props) : null
    }) as unknown as T
  }

  return lazy(clientImport) as unknown as T
}

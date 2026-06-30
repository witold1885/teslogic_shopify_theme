import { createElement, type ComponentType} from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from '../redux/store'

export function mountForShopify(
  elementId: string, 
  Component: ComponentType
) {
  if (typeof document !== 'undefined') {
    const rootElement = document.getElementById(elementId)
    
    if (rootElement) {
      createRoot(rootElement).render(
        createElement(Provider, {
          store,
          children: createElement(Component)
        })
      )
    }
  }
}

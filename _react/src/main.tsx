// @ts-ignore
__webpack_public_path__ = window.ShopifyReactData?.publicPath || ''
// @ts-ignore
export const __vite_public_path__ = window.ShopifyReactData?.publicPath || ''

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppProviders } from './AppProviders.tsx'

createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <App />
  </AppProviders>
)

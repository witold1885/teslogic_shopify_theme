// @ts-ignore
__webpack_public_path__ = window.ShopifyReactData?.publicPath || ''
// @ts-ignore
export const __vite_public_path__ = window.ShopifyReactData?.publicPath || ''

import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)

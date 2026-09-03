import { configureStore } from '@reduxjs/toolkit'
import contentReducer from './slices/content'
import productsReducer from './slices/products'
import reviewsReducer from './slices/reviews'
import subscribeReducer from './slices/subscribe'

const getInitialState = () => {
  const data: Window['ShopifyReactData'] = typeof window !== 'undefined' ? window.ShopifyReactData : null
  
  return {
    content: {
      ...data?.content,
      loading: false
    },
    products: {
      rate: 1,
      cartItemCount: data?.cart?.item_count || 0,
      products: [],
      product: data?.product,
      additionalProducts: data?.additionalProducts,
      loading: false
    }
  }
}

const store = configureStore({
  reducer: {
    content: contentReducer,
    products: productsReducer,
    reviews: reviewsReducer,
    subscribe: subscribeReducer,
  },
  preloadedState: getInitialState()
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

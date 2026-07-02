import { configureStore } from '@reduxjs/toolkit'
import contentReducer from './slices/content'
import productsReducer from './slices/products'
import reviewsReducer from './slices/reviews'

const getInitialState = () => {
  const data: Window['ShopifyReactData'] = window.ShopifyReactData
  
  return {
    content: {
      ...data?.content,
      loading: false,
      error: null
    }
  }
}

const store = configureStore({
  reducer: {
    content: contentReducer,
    products: productsReducer,
    reviews: reviewsReducer,
  },
  preloadedState: getInitialState()
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
